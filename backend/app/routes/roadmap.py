from fastapi import APIRouter, HTTPException
from app.models.schemas import RoadmapRequest, RoadmapResponse
from app.services.llm_service import generate_roadmap

router = APIRouter()


@router.post("/generate", response_model=RoadmapResponse)
async def generate_project_roadmap(request: RoadmapRequest):
    try:
        roadmap = generate_roadmap(
            title=request.title,
            description=request.description,
            tech_stack=request.techStack,
            difficulty=request.difficulty,
            domain=request.domain,
        )
        return RoadmapResponse(**roadmap)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate roadmap: {str(e)}")