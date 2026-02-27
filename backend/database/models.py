from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

    progress = relationship("Progress", back_populates="user")


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(String, nullable=False)
    lo_id = Column(String, nullable=False)

    mastery = Column(Float, default=0.0)
    attempts = Column(Integer, default=0)
    correct = Column(Integer, default=0)

    user = relationship("User", back_populates="progress")