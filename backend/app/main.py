from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import ideas, roadmap, stack, saved, chat, evolution, auth
from app.utils.database import init_db
from app.utils.user_store import create_user, user_exists
from app.utils.auth import get_password_hash

app = FastAPI(title="GenieAI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ideas.router,     prefix="/api/ideas",     tags=["Ideas"])
app.include_router(roadmap.router,   prefix="/api/roadmap",   tags=["Roadmap"])
app.include_router(stack.router,     prefix="/api/stack",     tags=["Stack"])
app.include_router(saved.router,     prefix="/api/saved",     tags=["Saved"])
app.include_router(chat.router,      prefix="/api/chat",      tags=["Chat"])
app.include_router(evolution.router, prefix="/api/evolution", tags=["Evolution"])
app.include_router(auth.router,      prefix="/api/auth",      tags=["Auth"])


@app.on_event("startup")
async def startup_event():
    # 1. Ensure the users table exists in PostgreSQL
    init_db()

    # 2. Seed default admin account (safe — uses ON CONFLICT DO NOTHING)
    email = "anu082singh@gmail.com"
    if not user_exists(email):
        create_user(
            email=email,
            hashed_password=get_password_hash("ananya02"),
            name="Ananya Singh",
            branch="Computer Science"
        )


@app.get("/")
def root():
    return {"message": "GenieAI API is running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}