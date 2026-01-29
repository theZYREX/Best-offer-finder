# scratch.py
import asyncio
import re
from playwright.async_api import async_playwright

# 1. Шаблон URL без лишних пробелов
BASE_URL = "https://www.farpost.ru/vladivostok/tech/communication/cellphones/+/SEARCH_QUERY/?sortBy=pricea"


def clean_price(price_text: str) -> int:
    """Извлекает цифры из строки цены."""
    if not price_text:
        return 0
    digits = re.findall(r'\d', price_text)
    return int("".join(digits)) if digits else 0


def build_full_url(href: str) -> str:
    """Формирует полный URL из относительного пути."""
    if not href or not isinstance(href, str):
        return "https://www.farpost.ru"
    href = href.strip()
    if href.startswith(("http://", "https://")):
        return href
    if href.startswith("//"):
        return f"https:{href}"
    if not href.startswith("/"):
        href = "/" + href
    return f"https://www.farpost.ru{href}"


def normalize_description(text: str) -> str:
    """Очищает описание от лишних переносов и пробелов."""
    if not text or not isinstance(text, str):
        return "Описание не найдено"
    cleaned = ' '.join(text.split()).strip()
    return cleaned if cleaned else "Описание не найдено"


async def parse_farpost(limit: int = 20, query: str = "Apple iPhone 15"):
    search_term = query.replace(" ", "+")
    target_url = BASE_URL.replace("SEARCH_QUERY", search_term)

    print(f"🔎 Запускаю парсер: '{query}' (макс. {limit})")
    print(f"🔗 URL: {target_url}")

    results = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            viewport={'width': 1440, 'height': 1080}
        )
        page = await context.new_page()

        try:
            await page.goto(target_url, timeout=45000, wait_until="domcontentloaded")

            try:
                await page.wait_for_selector('[data-doc-id]', timeout=15000)
            except:
                print("⚠️ Товары не найдены или тайм-аут ожидания.")
                return []

            listings = await page.query_selector_all('[data-doc-id]')
            print(f"Найдено {len(listings)} объявлений. Обрабатываю первые {limit}.")

            for i, listing in enumerate(listings[:limit]):
                external_id = await listing.get_attribute('data-doc-id')
                if not external_id:
                    continue

                item_data = {'external_id': external_id}

                link_element = await listing.query_selector('a.bulletinLink')
                if not link_element:
                    continue

                item_data['title'] = (await link_element.inner_text()).strip()

                date_elem = await listing.query_selector('.date')
                item_data['date'] = (await date_elem.inner_text()).strip() if date_elem else "Дата не указана"

                href = await link_element.get_attribute('href')
                item_data['url'] = build_full_url(href)  # ← ИСПОЛЬЗУЕМ ФУНКЦИЮ

                price_element = await listing.query_selector('[data-role="price"]')
                item_data['price'] = clean_price(await price_element.inner_text()) if price_element else 0

                # --- Детальная страница ---
                detail_page = await context.new_page()
                try:
                    await detail_page.goto(item_data['url'], timeout=30000, wait_until="domcontentloaded")

                    # Изображение
                    image_url = ""
                    img_elem = await detail_page.query_selector('img.image-gallery__big-image')
                    if img_elem:
                        src = await img_elem.get_attribute('src')
                        if src:
                            if src.startswith(('http://', 'https://')):
                                image_url = src
                            elif src.startswith('//'):
                                image_url = f"https:{src}"
                            elif src.startswith('/'):
                                image_url = f"https://www.farpost.ru{src}"

                    if not image_url:
                        fallback = await detail_page.query_selector('img[data-role="mainPhoto"]')
                        if fallback:
                            src = await fallback.get_attribute('src')
                            if src and src.startswith('/'):
                                image_url = f"https://www.farpost.ru{src}"
                            elif src and src.startswith('//'):
                                image_url = f"https:{src}"
                            elif src and src.startswith(('http://', 'https://')):
                                image_url = src

                    item_data['image_url'] = image_url or "https://via.placeholder.com/300?text=No+Image"

                    # Описание
                    description = "Описание не найдено"
                    desc_elem = await detail_page.query_selector(
                        '.bulletinText, p[data-field="text"], .bulletin-description, [data-role="description"], [itemprop="description"]'
                    )
                    if desc_elem:
                        raw_desc = await desc_elem.inner_text()
                        description = normalize_description(raw_desc)  # ← ИСПОЛЬЗУЕМ ФУНКЦИЮ
                    else:
                        if img_elem:
                            alt = await img_elem.get_attribute('alt')
                            if alt and isinstance(alt, str):
                                description = normalize_description(alt)

                    item_data['description'] = description

                except Exception as e:
                    print(f"⚠️ Ошибка деталей {external_id}: {e}")
                    item_data['image_url'] = "https://via.placeholder.com/300?text=Error"
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
