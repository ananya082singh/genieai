from fastapi import APIRouter, HTTPException
from app.models.schemas import SaveIdeaRequest, SavedIdea, ProjectIdea
from datetime import datetime
import uuid

router = APIRouter()

# In-memory store (replace with PostgreSQL in production)
_saved_ideas: dict[str, SavedIdea] = {}


@router.get("/", response_model=list[SavedIdea])
async def get_saved_ideas():
    return list(_saved_ideas.values())


@router.post("/", response_model=SavedIdea)
async def save_idea(request: SaveIdeaRequest):
    idea_id = str(uuid.uuid4())
    saved = SavedIdea(
        id=idea_id,
        idea=request.idea,
        savedAt=datetime.utcnow().isoformat()
    )
    _saved_ideas[idea_id] = saved
    return saved


@router.delete("/{idea_id}")
async def delete_saved_idea(idea_id: str):
    if idea_id not in _saved_ideas:
        raise HTTPException(status_code=404, detail="Saved idea not found")
    del _saved_ideas[idea_id]
    return {"message": "Idea removed successfully"}