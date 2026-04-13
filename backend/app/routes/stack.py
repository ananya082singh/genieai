from fastapi import APIRouter, HTTPException
from app.models.schemas import StackRequest, StackResponse
from app.services.llm_service import recommend_stack

router = APIRouter()


@router.post("/recommend", response_model=StackResponse)
async def recommend_tech_stack(request: StackRequest):
    try:
        stack = recommend_stack(
            project_description=request.projectDescription,
            team_size=request.teamSize,
            time_available=request.timeAvailable,
            deployment_target=request.deploymentTarget,
        )
        return StackResponse(**stack)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to recommend stack: {str(e)}")