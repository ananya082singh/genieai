from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import ideas, roadmap, stack, saved, chat, evolution
from app.routes import ideas, roadmap, stack, saved, chat, evolution, auth

app = FastAPI(title="GenieAI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ideas.router,   prefix="/api/ideas",   tags=["Ideas"])
app.include_router(roadmap.router, prefix="/api/roadmap", tags=["Roadmap"])
app.include_router(stack.router,   prefix="/api/stack",   tags=["Stack"])
app.include_router(saved.router,   prefix="/api/saved",   tags=["Saved"])
app.include_router(chat.router,    prefix="/api/chat",    tags=["Chat"])
app.include_router(evolution.router, prefix="/api/evolution", tags=["Evolution"])
app.include_router(auth.router,    prefix="/api/auth",    tags=["Auth"])

@app.get("/")
def root():
    return {"message": "GenieAI API is running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "ok"}