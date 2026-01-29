import asyncio
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import httpx

# Фикс для Windows
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

_cached_ads = []
http_client = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _cached_ads, http_client
    http_client = httpx.AsyncClient(timeout=15.0, follow_redirects=True)

    print("🚀 Сервер запускается...")

    # Первичная загрузка (по умолчанию iPhone 15)
    try:
        from scratch import parse_farpost
        print("📡 Загружаем стартовые объявления (iPhone 15)...")
        _cached_ads = await parse_farpost(limit=10, query="Apple iPhone 15")
        print(f"✅ Старт завершен! В кэше: {len(_cached_ads)}")
    except Exception as e:
        print(f"⚠️ Ошибка при старте: {e}")
        _cached_ads = []

    yield

    if http_client:
        await http_client.aclose()

app = FastAPI(title="BOF Parser API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 👇 ГЛАВНОЕ ИЗМЕНЕНИЕ ЗДЕСЬ
@app.get("/api/items")
async def get_items(q: str = Query(None)):
    """
    Если передан q (например ?q=Samsung), ищем в реальном времени.
    Если нет - отдаем кэшированный iPhone 15.
    """
    global _cached_ads

    # 1. Если есть поисковый запрос
    if q:
        print(f"🔎 Пришел запрос на поиск: {q}")
        from scratch import parse_farpost
        try:
            # Запускаем парсер под конкретный запрос
            search_results = await parse_farpost(limit=15, query=q)
            return {"items": search_results}
        except Exception as e:
            print(f"❌ Ошибка поиска: {e}")
            raise HTTPException(status_code=500, detail="Ошибка при поиске")

    # 2. Если запроса нет - отдаем то, что загрузили при старте
    return {"items": _cached_ads or []}

@app.get("/proxy/image")
async def proxy_image(url: str):
    if not url or not http_client: return Response(status_code=400)
    try:
        resp = await http_client.get(url)
        return Response(content=resp.content, media_type=resp.headers.get("content-type"))
    except:
        return Response(status_code=404)

if __name__ == "__main__":
    import uvicorn
    # reload=False важно для Windows + Playwright
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False, loop="asyncio")