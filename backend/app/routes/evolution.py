from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.llm_service import evolve_idea_step

router = APIRouter()

class EvolveStepRequest(BaseModel):
    title: str
    description: str
    techStack: list[str]
    stepLabel: str
    stepDescription: str

class EvolveStepResponse(BaseModel):
    guidance: str

@router.post("/step", response_model=EvolveStepResponse)
async def evolve_step(request: EvolveStepRequest):
    """Generates evolution guidance for a specific project stage"""
    try:
        guidance = evolve_idea_step(
            idea_title=request.title,
            idea_description=request.description,
            tech_stack=request.techStack,
            step_label=request.stepLabel,
            step_description=request.stepDescription
        )
        return EvolveStepResponse(guidance=guidance)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evolution failed: {str(e)}")