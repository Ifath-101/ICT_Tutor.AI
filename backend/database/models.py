from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from database.database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True) # made nullable to avoid issues with existing data if any
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

    progress = relationship("Progress", back_populates="user")
    submissions = relationship("Submission", back_populates="user")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(String, primary_key=True, index=True) # lesson1, lesson2
    title = Column(String, nullable=False)
    grade_level = Column(String)
    main_topic = Column(String)
    scope = Column(Text)

    learning_objectives = relationship("LearningObjective", back_populates="lesson")


class LearningObjective(Base):
    __tablename__ = "learning_objectives"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(String, ForeignKey("lessons.id"))
    lo_id = Column(String, nullable=False) # LO1, LO2
    objective = Column(Text, nullable=False)
    cognitive_level = Column(String)
    question_types = Column(JSON) # Store list of strings

    lesson = relationship("Lesson", back_populates="learning_objectives")


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(String, ForeignKey("lessons.id"))
    lo_id = Column(String, nullable=False)

    mastery = Column(Float, default=0.0)
    attempts = Column(Integer, default=0)
    correct = Column(Integer, default=0)

    user = relationship("User", back_populates="progress")


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(String, ForeignKey("lessons.id"))
    lo_id = Column(String, nullable=False)
    
    student_answer = Column(Text, nullable=False)
    correct_answer = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="submissions")