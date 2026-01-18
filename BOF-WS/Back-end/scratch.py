import asyncio
import re
import json
from playwright.async_api import async_playwright

TARGET_URL = "https://www.farpost.ru/vladivostok/tech/communication/cellphones/+/Apple+iPhone+15/"
## https://www.farpost.ru/    vladivostok      /     tech      / communication /    cellphones   /  +  / Apple+iPhone+15 /   ?sortBy=pricea
#  ?sortBy=pricea - sorting from lower to higher price
#  ?sortBy=priced - sorting from higher to lower price


# 'Соединяем цифры в цене в единое число и переводим его в int'
def clean_price(price_text: str) -> int:
    if not price_text:
        return 0
    digits = re.findall(r'\d', price_text)
    if digits:
        return int("".join(digits))
    return 0


async def parse_farpost():
    print("Запускаю парсер")

    results = []

    # 'запускаем парсер он открывает браузер и создает фейк пользователя'
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            viewport={'width': 1920, 'height': 1080}
        )
        page = await context.new_page()

        try:
            await page.goto(TARGET_URL, timeout=450000, wait_until="domcontentloaded")
            print(f"Зашел на {TARGET_URL}")

            # 'парсер ожидает пока в коде html появится данная строчка код "tr[data-doc-id]" '
            # '  и этот самый id является id объявления того или иного. ID уникален     '

            print("Ожидаю появления первого объявления")
            await page.wait_for_selector('tr[data-doc-id]', timeout=30000)

            count_element_locator = page.locator("#itemsCount_placeholder")
            count_str = await count_element_locator.get_attribute('data-count')
            print(f'Общее число объявлений: {count_str}')

            # парсер считает все количество объявлений на странице, но пока не проскролишь первые 50 объявлений, следующие не появятся
            listings = await page.query_selector_all('tr[data-doc-id]')
            print(f"📊 Найдено {len(listings)} объявлений на первой странице.")

            for listing in listings:
                item_data = {'external_id': await listing.get_attribute('data-doc-id')}
                if not item_data['external_id']:
                    continue

                # достаем ссылку на полное объявление из кода страницы
                link_element = await listing.query_selector('a.bulletinLink')
                if link_element:
                    item_data['title'] = (await link_element.inner_text()).strip()
                    href = await link_element.get_attribute('href')
                    item_data['url'] = f"https://www.farpost.ru{href}"
                else:
                    item_data['title'], item_data['url'] = "N/A", "N/A"

                # достаем цену по определенной строчке кода html
                price_element = await listing.query_selector('[data-role="price"]')
                if price_element:
                    price_raw_text = await price_element.inner_text()
                    item_data['price'] = clean_price(price_raw_text)
                else:
                    item_data['price'] = 0

                # --- Местоположение (магазин или пользователь) ---
                # Ищем по классу ellipsis-text__left-side, это имя продавца
                location_element = await listing.query_selector('div.ellipsis-text__left-side')
                if location_element:
                    item_data['location'] = (await location_element.inner_text()).strip()
                else:
                    item_data['location'] = "N/A"

                results.append(item_data)

        except Exception as e:
            print(f"Произошла ошибка: {e}")
            screenshot_path = 'farpost_error_v3.png'
            await page.screenshot(path=screenshot_path)

        finally:
            await browser.close()

    return results


async def main():
    scraped_data = await parse_farpost()
    if scraped_data:
        print("\n--- Результаты парсинга ---")
        print(json.dumps(scraped_data, indent=2, ensure_ascii=False))
        print(f"\n Успешно собрано {len(scraped_data)} объявлений.")
    else:
        print(" Не удалось собрать данные. Проверь скриншот ошибки, если он был создан.")


if __name__ == "__main__":
    asyncio.run(main())