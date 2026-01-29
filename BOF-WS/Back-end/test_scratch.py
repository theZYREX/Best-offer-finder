# test_scratch.py
import pytest
from scratch import clean_price, normalize_description, build_full_url


# === Тесты для clean_price ===
def test_clean_price_positive():
    assert clean_price("5 000 ₽") == 5000
    assert clean_price("10999") == 10999
    assert clean_price("Цена: 42 руб.") == 42

def test_clean_price_negative():
    assert clean_price("") == 0
    assert clean_price(None) == 0
    assert clean_price("Бесплатно") == 0

def test_clean_price_edge():
    assert clean_price("0") == 0
    assert clean_price("1") == 1


# === Тесты для normalize_description ===
def test_normalize_description_positive():
    assert normalize_description("Привет\n\nмир!") == "Привет мир!"
    assert normalize_description("  Много   пробелов  ") == "Много пробелов"

def test_normalize_description_negative():
    assert normalize_description("") == "Описание не найдено"
    assert normalize_description(None) == "Описание не найдено"
    assert normalize_description(123) == "Описание не найдено"

def test_normalize_description_edge():
    assert normalize_description("OK") == "OK"
    assert normalize_description("\n\t\r") == "Описание не найдено"


# === Тесты для build_full_url ===
def test_build_full_url_positive():
    assert build_full_url("/abc") == "https://www.farpost.ru/abc"
    assert build_full_url("def") == "https://www.farpost.ru/def"
    assert build_full_url("https://example.com") == "https://example.com"

def test_build_full_url_negative():
    assert build_full_url("") == "https://www.farpost.ru"
    assert build_full_url(None) == "https://www.farpost.ru"
    assert build_full_url(123) == "https://www.farpost.ru"

def test_build_full_url_edge():
    assert build_full_url("/") == "https://www.farpost.ru/"
    assert build_full_url(" path ") == "https://www.farpost.ru/path"