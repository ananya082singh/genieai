from pydantic import BaseModel
from typing import List, Optional


class IdeaRequest(BaseModel):
    branch: str
    skills: str
    interests: str
    domain: Optional[str] = None
    difficulty: Optional[str] = None


class ProjectIdea(BaseModel):
    title: str
    description: str
    domain: str
    difficulty: str
    techStack: List[str]
    outcome: str
    novelty: str


class IdeaResponse(BaseModel):
    ideas: List[ProjectIdea]
    total: int


class RoadmapRequest(BaseModel):
    title: str
    description: str
    techStack: List[str]
    difficulty: str
    domain: Optional[str] = None


class WeekResource(BaseModel):
    label: str
    type: str


class WeekPlan(BaseModel):
    week: str
    phase: str
    tasks: str
    milestone: str
    resources: List[WeekResource]


class RoadmapResponse(BaseModel):
    overview: str
    weeks: List[WeekPlan]
    finalMilestone: str


class StackRequest(BaseModel):
    projectDescription: str
    teamSize: str = "Solo"
    timeAvailable: str = "6 months"
    deploymentTarget: str = "Web"


class StackLayer(BaseModel):
    technologies: List[str]
    why: str


class StackResponse(BaseModel):
    frontend: Optional[StackLayer] = None
    backend: Optional[StackLayer] = None
    database: Optional[StackLayer] = None
    ai_ml: Optional[StackLayer] = None
    devops: Optional[StackLayer] = None
    extras: Optional[StackLayer] = None
    summary: str


class SaveIdeaRequest(BaseModel):
    idea: ProjectIdea


class SavedIdea(BaseModel):
    id: str
    idea: ProjectIdea
    savedAt: str


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]


class ChatResponse(BaseModel):
    reply: str
    
# Authentication Models
class UserRegister(BaseModel):
    email: str
    password: str
    name: str
    branch: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    id: str
    email: str
    name: str
    branch: Optional[str] = None    