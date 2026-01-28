import asyncio
import re
from playwright.async_api import async_playwright

TARGET_URL = "https://www.farpost.ru/vladivostok/tech/communication/cellphones/+/Apple+iPhone+15/?sortBy=pricea"

def clean_price(price_text: str) -> int:
    if not price_text:
        return 0
    digits = re.findall(r'\d', price_text)
    return int("".join(digits)) if digits else 0


async def parse_farpost(limit: int = 20):
    print(f"Запускаю парсер для iPhone 15 (макс. {limit} объявлений)...")
    results = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            viewport={'width': 1440, 'height': 1080}
        )
        page = await context.new_page()

        try:
            await page.goto(TARGET_URL, timeout=45000, wait_until="domcontentloaded")
            await page.wait_for_selector('tr[data-doc-id]', timeout=30000)

            listings = await page.query_selector_all('tr[data-doc-id]')
            print(f"Найдено {len(listings)} объявлений. Обрабатываю первые {limit}.")

            for i, listing in enumerate(listings[:limit]):
                item_data = {}

                link_element = await listing.query_selector('a.bulletinLink')
                if link_element:
                    item_data['title'] = (await link_element.inner_text()).strip()

                    date_elem = await listing.query_selector('.date')
                    raw_date = await date_elem.inner_text()
                    item_data['date'] = raw_date.strip()

                    href = await link_element.get_attribute('href')
                    item_data['url'] = f"https://www.farpost.ru{href}"
                else:
                    item_data['title'], item_data['url'] = "N/A", "N/A"

                price_element = await listing.query_selector('[data-role="price"]')
                item_data['price'] = clean_price(await price_element.inner_text()) if price_element else 0


                detail_page = await context.new_page()
                try:
                    await detail_page.goto(item_data['url'], timeout=30000, wait_until="domcontentloaded")

                    image_url = "https://via.placeholder.com/300?text=No+Image"
                    img_elem = await detail_page.query_selector('img.image-gallery__big-image')
                    if img_elem:
                        src = await img_elem.get_attribute('src')
                        if src and src.startswith(('http://', 'https://')):
                            image_url = src
                        elif src:
                            image_url = f"https://www.farpost.ru{src}"
                    else:
                        # Fallback
                        fallback_img = await detail_page.query_selector('img[src*="farpost.ru"], img[data-role="mainPhoto"]')
                        if fallback_img:
                            src2 = await fallback_img.get_attribute('src')
                            if src2 and src2.startswith(('http://', 'https://')):
                                image_url = src2

                    item_data['image_url'] = image_url

                    description = "Описание не найдено"
                    desc_elem = await detail_page.query_selector(
                        '.bulletin-description, [data-role="description"], [itemprop="description"]'
                    )
                    if desc_elem:
                        raw_desc = await desc_elem.inner_text()
                        description = ' '.join(raw_desc.split())  # убираем лишние переносы
                    else:
                        alt = await img_elem.get_attribute('alt') if img_elem else ""
                        if alt:
                            description = alt

                    item_data['description'] = description

                except Exception as e:
                    print(f"⚠️ Ошибка при парсинге деталей {item_data['external_id']}: {e}")
                    item_data['image_url'] = "https://via.placeholder.com/300?text=Error"
                    item_data['description'] = "Не удалось загрузить описание"
                finally:
                    await detail_page.close()

                results.append(item_data)
                print(f"✅ [{i+1}/{limit}] {item_data['title']}")

        except Exception as e:
            print(f"❌ Критическая ошибка: {e}")
            await page.screenshot(path='error.png')
        finally:
            await browser.close()

    return results

if __name__ == "__main__":
    async def test():
        data = await parse_farpost(limit=5)
        print(f"Итог теста: Найдено {len(data)} объявлений")

    asyncio.run(test())