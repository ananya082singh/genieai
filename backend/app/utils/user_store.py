import uuid
from typing import Dict, Optional

# In-memory user database (will be replaced with PostgreSQL later)
users_db: Dict[str, dict] = {}

def create_user(email: str, hashed_password: str, name: str, branch: str = None) -> dict:
    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "email": email,
        "password": hashed_password,
        "name": name,
        "branch": branch
    }
    users_db[email] = user
    return user

def get_user_by_email(email: str) -> Optional[dict]:
    return users_db.get(email)

def user_exists(email: str) -> bool:
    return email in users_db