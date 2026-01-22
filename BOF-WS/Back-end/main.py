import asyncio
import sys

# 1. Это ДОЛЖНО быть в самом начале
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scratch import parse_farpost

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/items")
async def get_items(q: str = "Apple iPhone 13"):
    try:
        data = await parse_farpost(query=q)
        return data
    except Exception as e:
        # Теперь мы увидим реальную ошибку, если она будет
        print(f"Критическая ошибка: {e}")
        return {"error": str(e)}