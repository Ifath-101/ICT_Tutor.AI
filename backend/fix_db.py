from database.database import engine
from sqlalchemy import text

def add_name_column():
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE users ADD COLUMN name VARCHAR;"))
            conn.commit()
            print("Successfully added 'name' column to 'users' table.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    add_name_column()
