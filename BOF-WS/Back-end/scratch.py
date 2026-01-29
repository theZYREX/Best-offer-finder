import asyncio
import re
from playwright.async_api import async_playwright

# 1. Используем шаблон вместо жесткой ссылки. SEARCH_QUERY будет заменяться.
BASE_URL = "https://www.farpost.ru/vladivostok/tech/communication/cellphones/+/SEARCH_QUERY/?sortBy=pricea"

def clean_price(price_text: str) -> int:
    if not price_text:
        return 0
    digits = re.findall(r'\d', price_text)
    return int("".join(digits)) if digits else 0

# 2. Добавляем аргумент query с дефолтным значением
async def parse_farpost(limit: int = 20, query: str = "Apple iPhone 15"):
    # Формируем ссылку: заменяем пробелы на плюсы и вставляем в URL
    search_term = query.replace(" ", "+")
    target_url = BASE_URL.replace("SEARCH_QUERY", search_term)

    print(f"🔎 Запускаю парсер: '{query}' (макс. {limit})")
    print(f"🔗 URL: {target_url}")

    results = []

    async with async_playwright() as p:
        # headless=False чтобы ты видел процесс. Потом можно поставить True.
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            viewport={'width': 1440, 'height': 1080}
        )
        page = await context.new_page()

        try:
            await page.goto(target_url, timeout=45000, wait_until="domcontentloaded")

            # Ждем появления списка товаров
            try:
                await page.wait_for_selector('tr[data-doc-id]', timeout=15000)
            except:
                print("⚠️ Товары не найдены или тайм-аут ожидания.")
                return []

            listings = await page.query_selector_all('tr[data-doc-id]')
            print(f"Найдено {len(listings)} объявлений. Обрабатываю первые {limit}.")

            for i, listing in enumerate(listings[:limit]):
                item_data = {'external_id': await listing.get_attribute('data-doc-id')}

                if not item_data['external_id']:
                    continue

                # --- Заголовок, Дата, URL ---
                link_element = await listing.query_selector('a.bulletinLink')
                if link_element:
                    item_data['title'] = (await link_element.inner_text()).strip()

                    date_elem = await listing.query_selector('.date')
                    if date_elem:
                        raw_date = await date_elem.inner_text()
                        item_data['date'] = raw_date.strip()
                    else:
                        item_data['date'] = "Дата не указана"

                    href = await link_element.get_attribute('href')
                    item_data['url'] = f"https://www.farpost.ru{href}"
                else:
                    continue # Пропускаем битые объявления

                # --- Цена ---
                price_element = await listing.query_selector('[data-role="price"]')
                item_data['price'] = clean_price(await price_element.inner_text()) if price_element else 0

                # --- Заходим внутрь объявления ---
                detail_page = await context.new_page()
                try:
                    await detail_page.goto(item_data['url'], timeout=30000, wait_until="domcontentloaded")

                    # 🖼️ Картинка
                    image_url = ""
                    img_elem = await detail_page.query_selector('img.image-gallery__big-image')
                    if img_elem:
                        src = await img_elem.get_attribute('src')
                        if src and src.startswith(('http', '//')):
                            image_url = src if src.startswith('http') else f"https:{src}"

                    if not image_url:
                        # Fallback картинка
                        fallback = await detail_page.query_selector('img[data-role="mainPhoto"]')
                        if fallback:
                            src = await fallback.get_attribute('src')
                            image_url = src

                    item_data['image_url'] = image_url

                    # 📝 Описание (Твоя улучшенная логика)
                    description = "Описание не найдено"
                    desc_elem = await detail_page.query_selector('.bulletinText, p[data-field="text"]')

                    if not desc_elem:
                        desc_elem = await detail_page.query_selector(
                            '.bulletin-description, [data-role="description"], [itemprop="description"]'
                        )

                    if desc_elem:
                        raw_desc = await desc_elem.inner_text()
                        description = raw_desc.strip()
                    else:
                        # Если совсем нет описания, берем alt картинки
                        if img_elem:
                            alt = await img_elem.get_attribute('alt')
                            if alt: description = alt

                    item_data['description'] = description

                except Exception as e:
                    print(f"⚠️ Ошибка деталей {item_data['external_id']}: {e}")
                    item_data['image_url'] = ""
                    item_data['description'] = "Ошибка загрузки"
                finally:
                    await detail_page.close()

                results.append(item_data)
                print(f"✅ [{i+1}/{limit}] {item_data['title']}")

        except Exception as e:
            print(f"❌ Ошибка парсера: {e}")
        finally:
            await browser.close()

    return results

if __name__ == "__main__":
    asyncio.run(parse_farpost(limit=3, query="iPhone 13"))