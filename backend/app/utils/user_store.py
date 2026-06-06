import uuid
from typing import Optional
from app.utils.database import get_connection


def create_user(email: str, hashed_password: str, name: str, branch: str = None) -> dict:
    conn = get_connection()
    cur = conn.cursor()
    user_id = str(uuid.uuid4())
    cur.execute(
        """
        INSERT INTO users (id, email, password, name, branch)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (email) DO NOTHING
        RETURNING id, email, password, name, branch
        """,
        (user_id, email, hashed_password, name, branch)
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if row:
        return dict(row)
    # User already existed (ON CONFLICT DO NOTHING) — fetch and return
    return get_user_by_email(email)


def get_user_by_email(email: str) -> Optional[dict]:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, email, password, name, branch FROM users WHERE email = %s", (email,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    return dict(row) if row else None


def user_exists(email: str) -> bool:
    return get_user_by_email(email) is not None