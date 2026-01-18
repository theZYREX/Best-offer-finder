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

@app.get("/api/parse")
async def get_listings():
    data = await parse_farpost()
    return data