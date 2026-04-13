from fastapi import APIRouter, HTTPException
from app.models.schemas import IdeaRequest, IdeaResponse, ProjectIdea
from app.services.llm_service import generate_ideas

router = APIRouter()


@router.post("/generate", response_model=IdeaResponse)
async def generate_project_ideas(request: IdeaRequest):
    try:
        raw_ideas = generate_ideas(
            branch=request.branch,
            skills=request.skills,
            interests=request.interests,
            domain=request.domain,
            difficulty=request.difficulty,
        )
        ideas = [ProjectIdea(**idea) for idea in raw_ideas]
        return IdeaResponse(ideas=ideas, total=len(ideas))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate ideas: {str(e)}")