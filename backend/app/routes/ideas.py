from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.models.schemas import IdeaRequest, IdeaResponse, ProjectIdea
from app.services.llm_service import (
    generate_ideas,
    analyze_project_difficulty
)

router = APIRouter()


# -----------------------------
# Request Model for Difficulty Analysis
# -----------------------------
class DifficultyRequest(BaseModel):
    title: str
    description: str
    techStack: list[str]
    userSkills: str = ""


# -----------------------------
# Generate Project Ideas
# -----------------------------
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

        return IdeaResponse(
            ideas=ideas,
            total=len(ideas)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate ideas: {str(e)}"
        )


# -----------------------------
# Analyze Difficulty
# -----------------------------
@router.post("/analyze-difficulty")
async def analyze_difficulty(request: DifficultyRequest):
    try:
        result = analyze_project_difficulty(
            idea_title=request.title,
            idea_description=request.description,
            tech_stack=request.techStack,
            user_skills=request.userSkills
        )

        return result

    except Exception as e:
        print("DIFFICULTY ANALYSIS ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )