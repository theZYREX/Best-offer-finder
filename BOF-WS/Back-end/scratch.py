import re
from playwright.async_api import async_playwright

#TARGET_URL = "https://www.farpost.ru/vladivostok/tech/communication/cellphones/+/Apple+iPhone+13/?sortBy=pricea"
# https://www.farpost.ru/    vladivostok      /     tech      / communication /    cellphones   /  +  / Apple+iPhone+15 /   ?sortBy=pricea      /   &page=2
#  ?sortBy=pricea - sorting from lower to higher price
#  ?sortBy=priced - sorting from higher to lower price

# Функция для очистки цены остается прежней
def clean_price(price_text: str) -> int:
    if not price_text: return 0
    digits = re.findall(r'\d', price_text)
    return int("".join(digits)) if digits else 0



async def parse_farpost(query="Apple iPhone 13"):
    formatted_query = query.replace(" ", "+")

    base_url = "https://www.farpost.ru/vladivostok/tech/communication/cellphones/+/"
    url = f"{base_url}{formatted_query}/?sortBy=pricea"

    print(f"Парсим URL: {url}")
    results = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False) # Поставь False, если хочешь видеть процесс
        context = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36")
        page = await context.new_page()

        try:
            await page.goto(url, timeout=60000)
            # Ждем появления хотя бы одной строки товара
            await page.wait_for_selector('tr[data-doc-id]', timeout=15000)
            listings = await page.query_selector_all('tr[data-doc-id]')

            for listing in listings:
                item_data = {}

                item_data['external_id'] = await listing.get_attribute('data-doc-id')
                link_el = await listing.query_selector('a.bulletinLink')
                item_data['title'] = (await link_el.inner_text()).strip() if link_el else "N/A"
                href = await link_el.get_attribute('href') if link_el else ""
                item_data['url'] = f"https://www.farpost.ru{href}"

                price_el = await listing.query_selector('[data-role="price"]')
                if price_el:
                    price_raw = await price_el.inner_text()
                    item_data['price'] = clean_price(price_raw)

                img_el = await listing.query_selector('.bull-item__image-cell img')
                if img_el:

                    img_src = await img_el.get_attribute('src')
                    item_data['images'] = [img_src] if img_src else []
                else:
                    item_data['images'] = ["https://via.placeholder.com/300x200?text=No+Photo"]

                date_el = await listing.query_selector('.date')
                if date_el:
                    item_data['date'] = (await date_el.inner_text()).strip()
                else:
                    item_data['date'] = "Дата неизвестна"

                results.append(item_data)

        except Exception as e:
            print(f"Ошибка в парсере: {e}")
            return [] # Возвращаем пустой список вместо падения
        finally:
            await browser.close()