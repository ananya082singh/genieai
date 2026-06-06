import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")


def get_connection():
    """Get a new PostgreSQL connection."""
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)


def init_db():
    """Create the users table if it doesn't already exist."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email       VARCHAR(255) UNIQUE NOT NULL,
            password    TEXT NOT NULL,
            name        VARCHAR(255) NOT NULL,
            branch      VARCHAR(255),
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    cur.close()
    conn.close()
