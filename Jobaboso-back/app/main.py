from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

import os
from fastapi_limiter import FastAPILimiter
from redis.asyncio import Redis

from db.session import engine
from db.base import Base
from routes import user as user_router
from routes import spec as spec_router
from routes import company as company_router
from routes import test as test_router
from routes import personal as personal_router
from routes import company_application as company_application_router
from routes import job_review as job_review_router
from routes import staff_ai_search as staff_ai_search_router
from routes import university_staff as university_staff_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6378")
    redis = Redis.from_url(redis_url, encoding="utf-8", decode_responses=True)
    await FastAPILimiter.init(redis)
    yield

app = FastAPI(lifespan=lifespan)
Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user_router.router,tags=["user"])
app.include_router(spec_router.router,tags=["spec"])
app.include_router(company_router.router,tags=["company"])
app.include_router(personal_router.router,tags=["personal"])
app.include_router(company_application_router.router,tags=["company_applications"])
app.include_router(job_review_router.router,tags=["job_reviews"])
app.include_router(university_staff_router.router,tags=["university_staff"])
app.include_router(test_router.router,tags=["test"])
app.include_router(staff_ai_search_router.router,tags=["staff_ai_search"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)