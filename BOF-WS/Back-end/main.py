import asyncio
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import httpx

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())


_cached_ads = []
http_client = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _cached_ads, http_client

    http_client = httpx.AsyncClient(timeout=15.0, follow_redirects=True)

    print("🚀 Запуск сервера...")

    await asyncio.sleep(1)

    try:
        print("📡 Запуск парсера...")
        from scratch import parse_farpost
        _cached_ads = await parse_farpost(limit=20)
        print(f"✅ Готово! Загружено: {len(_cached_ads)}")
    except Exception as e:
        print(f"❌ Ошибка парсера: {e}")
        import traceback
        traceback.print_exc()

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

@app.get("/api/items")
async def get_items():
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
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=False,
        loop="asyncio"
    )