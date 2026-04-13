import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"


def _clean_json(raw: str) -> str:
    """Strip markdown code fences and return clean JSON string."""
    raw = raw.strip()
    raw = re.sub(r"^```json\s*", "", raw)
    raw = re.sub(r"^```\s*", "", raw)
    raw = re.sub(r"```$", "", raw)
    return raw.strip()


def generate_ideas(branch: str, skills: str, interests: str,
                   domain: str = None, difficulty: str = None) -> list:
    domain_clause = f"Domain focus: {domain}" if domain else "Domain: open to any"
    diff_clause = f"Difficulty: {difficulty}" if difficulty else "Difficulty: any level"

    prompt = f"""Generate exactly 4 unique and innovative final year engineering project ideas for a student with these details:

Branch/Specialization: {branch}
Technical Skills: {skills}
Interests & Problem Areas: {interests}
{domain_clause}
{diff_clause}

Return ONLY a valid JSON array, no markdown, no explanation, no extra text:
[
  {{
    "title": "Specific Project Title",
    "description": "2-3 sentence description explaining what the project does and its real-world impact",
    "domain": "one of: AI/ML, Web, Mobile, IoT, Blockchain, Cybersecurity, Cloud, AR/VR, Healthcare, FinTech, EdTech",
    "difficulty": "Beginner or Intermediate or Advanced",
    "techStack": ["tech1", "tech2", "tech3", "tech4", "tech5"],
    "outcome": "What the student demonstrates/achieves on completing this",
    "novelty": "What makes this project innovative or impactful"
  }}
]"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are a senior engineering professor and project advisor. Respond ONLY with valid JSON. No explanation. No markdown."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.8,
        max_tokens=3000,
    )
    raw = response.choices[0].message.content
    return json.loads(_clean_json(raw))


def generate_roadmap(title: str, description: str, tech_stack: list,
                     difficulty: str, domain: str = None) -> dict:
    prompt = f"""Create a detailed 12-week project roadmap for this final year project:

Project Title: {title}
Description: {description}
Tech Stack: {", ".join(tech_stack)}
Difficulty: {difficulty}
Domain: {domain or "General"}

Return ONLY a valid JSON object:
{{
  "overview": "2-sentence project overview and goal",
  "weeks": [
    {{
      "week": "Week 1-2",
      "phase": "Setup & Planning",
      "tasks": "Detailed description of what to build/learn this period",
      "milestone": "Concrete deliverable for this period",
      "resources": [
        {{"label": "Resource name", "type": "YouTube or Docs or Tool or Course"}}
      ]
    }}
  ],
  "finalMilestone": "What the complete project achieves"
}}

Generate exactly 6 week-groups covering: Environment Setup, Core Architecture, Feature Development, Advanced Features, Testing & Optimization, Deployment & Presentation.
Each week group must have 2-4 resources."""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are an expert project planning engineer. Return ONLY valid JSON. No markdown. No explanation."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=4000,
    )
    raw = response.choices[0].message.content
    return json.loads(_clean_json(raw))


def recommend_stack(project_description: str, team_size: str,
                    time_available: str, deployment_target: str) -> dict:
    prompt = f"""Recommend the optimal, modern tech stack for this student project:

Project: {project_description}
Team Size: {team_size}
Timeline: {time_available}
Deployment Target: {deployment_target}

Return ONLY valid JSON:
{{
  "frontend": {{"technologies": ["tech1", "tech2"], "why": "reason"}},
  "backend": {{"technologies": ["tech1", "tech2"], "why": "reason"}},
  "database": {{"technologies": ["tech1"], "why": "reason"}},
  "ai_ml": {{"technologies": ["tech1", "tech2"], "why": "reason or skip if not needed"}},
  "devops": {{"technologies": ["tech1", "tech2"], "why": "reason"}},
  "extras": {{"technologies": ["tool1", "tool2"], "why": "reason"}},
  "summary": "2-sentence rationale for the overall technology choices"
}}"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are a senior software architect. Return ONLY valid JSON. No markdown. No explanation."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.6,
        max_tokens=2000,
    )
    raw = response.choices[0].message.content
    return json.loads(_clean_json(raw))


def chat_with_assistant(messages: list) -> str:
    groq_messages = [
        {"role": "system", "content": "You are GenieAI, an expert academic project advisor helping engineering students with their final year projects. Be concise, practical, and encouraging. Provide actionable, specific guidance."}
    ] + messages

    response = client.chat.completions.create(
        model=MODEL,
        messages=groq_messages,
        temperature=0.7,
        max_tokens=1000,
    )
    return response.choices[0].message.content