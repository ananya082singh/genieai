import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"


# ---------------------------------------------------
# CLEAN JSON
# ---------------------------------------------------
def _clean_json(raw: str) -> str:
    raw = raw.strip()
    raw = re.sub(r"^```json\s*", "", raw)
    raw = re.sub(r"^```\s*", "", raw)
    raw = re.sub(r"```$", "", raw)
    return raw.strip()


# ---------------------------------------------------
# GENERATE IDEAS
# ---------------------------------------------------
def generate_ideas(branch, skills, interests, domain=None, difficulty=None):

    prompt = f"""
Generate exactly 4 innovative engineering final year project ideas.

Branch: {branch}
Skills: {skills}
Interests: {interests}
Domain: {domain}
Difficulty: {difficulty}

Return ONLY valid JSON array:
[
  {{
    "title": "",
    "description": "",
    "domain": "",
    "difficulty": "",
    "techStack": [],
    "outcome": "",
    "novelty": ""
  }}
]
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "Return ONLY valid JSON."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_tokens=2500,
    )

    raw = response.choices[0].message.content

    try:
        cleaned = _clean_json(raw)
        return json.loads(cleaned)

    except Exception as e:
        print("GENERATE IDEAS ERROR:", e)
        print(raw)
        raise e


# ---------------------------------------------------
# GENERATE ROADMAP
# ---------------------------------------------------
def generate_roadmap(title, description, tech_stack, difficulty, domain=None):

    prompt = f"""
Create a detailed 12-week roadmap.

Project: {title}
Description: {description}
Tech Stack: {', '.join(tech_stack)}
Difficulty: {difficulty}
Domain: {domain}

Return ONLY valid JSON:
{{
  "overview": "",
  "weeks": [],
  "finalMilestone": ""
}}
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "Return ONLY valid JSON."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.6,
        max_tokens=3000,
    )

    raw = response.choices[0].message.content

    try:
        cleaned = _clean_json(raw)
        return json.loads(cleaned)

    except Exception as e:
        print("ROADMAP ERROR:", e)
        print(raw)
        raise e


# ---------------------------------------------------
# RECOMMEND STACK
# ---------------------------------------------------
def recommend_stack(project_description, team_size, time_available, deployment_target):

    prompt = f"""
Recommend a modern tech stack.

Project: {project_description}
Team Size: {team_size}
Timeline: {time_available}
Deployment: {deployment_target}

Return ONLY valid JSON.
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "Return ONLY valid JSON."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.5,
        max_tokens=2000,
    )

    raw = response.choices[0].message.content

    try:
        cleaned = _clean_json(raw)
        return json.loads(cleaned)

    except Exception as e:
        print("STACK ERROR:", e)
        print(raw)
        raise e


# ---------------------------------------------------
# CHAT ASSISTANT
# ---------------------------------------------------
def chat_with_assistant(messages):

    groq_messages = [
        {
            "role": "system",
            "content": "You are GenieAI, an expert engineering project mentor."
        }
    ] + messages

    response = client.chat.completions.create(
        model=MODEL,
        messages=groq_messages,
        temperature=0.7,
        max_tokens=1000,
    )

    return response.choices[0].message.content


# ---------------------------------------------------
# DIFFICULTY ANALYSIS
# ---------------------------------------------------
def analyze_project_difficulty(
    idea_title,
    idea_description,
    tech_stack,
    user_skills
):

    prompt = f"""
Analyze this project difficulty.

Project Title: {idea_title}
Description: {idea_description}
Tech Stack: {', '.join(tech_stack)}
Student Skills: {user_skills}

Return ONLY valid JSON:
{{
  "difficulty_score": 7,
  "skill_match_percent": 60,
  "missing_skills": [],
  "known_skills": [],
  "estimated_weeks": 12,
  "learning_curve": "Moderate",
  "complexity_breakdown": {{
    "frontend": 5,
    "backend": 7,
    "ai_ml": 8,
    "deployment": 4
  }},
  "recommendation": ""
}}
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "Return ONLY valid JSON."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,
        max_tokens=1200,
    )

    raw = response.choices[0].message.content

    try:
        cleaned = _clean_json(raw)

        print("DIFFICULTY RESPONSE:", cleaned)

        return json.loads(cleaned)

    except Exception as e:
        print("DIFFICULTY JSON ERROR:", e)
        print(raw)
        raise e


# ---------------------------------------------------
# AI IDEA EVOLUTION
# ---------------------------------------------------
def evolve_idea_step(idea_title, idea_description, tech_stack, step_label, step_description):
    """
    Evolves a project idea through a specific stage
    """
    prompt = f"""For this final year project:

Project: "{idea_title}"
Description: {idea_description}
Current Tech Stack: {', '.join(tech_stack)}

Evolution Stage: "{step_label}"
Stage Goal: {step_description}

Provide a practical, detailed implementation guide for THIS SPECIFIC STAGE.

Include:
1. What to build in this stage
2. Specific technologies/tools to use (be concrete)
3. Code approach and architecture decisions
4. What this stage unlocks for the project

Keep it actionable and specific to THIS project. 150 words max.

Return plain text, no JSON, no markdown formatting."""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a senior project architect providing stage-by-stage implementation guidance. Be specific and practical."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_tokens=500,
    )

    return response.choices[0].message.content.strip()