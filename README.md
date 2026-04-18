# ICT Tutor AI — Intelligent Tutoring System

Welcome to the **ICT Tutor AI**, a modern, intelligent, and interactive learning platform designed specifically for ICT (Information and Communication Technology) students. Developed using a robust full-stack architecture, this application personalizes the educational experience through an AI-powered Chatbot, dynamic assessments, comprehensive progress tracking, and syllabus-constrained tutoring.

### 🌐 Live Demo
The application is currently live and deployed! Check it out here:
**[https://ict-tutor-ai.vercel.app/](https://ict-tutor-ai.vercel.app/)**

---

## 🌟 Introduction

ICT Tutor AI moves beyond static curriculum delivery to create a proactive remote learning environment. By combining modern front-end aesthetics (like glassmorphism and real-time visual progress) with powerful AI logic in the backend, the system continuously analyzes student performance, detects misconceptions, and supports active learning methods without diverging from the approved syllabus thanks to advanced Retrieval-Augmented Generation (RAG).

Whether it’s reviewing concepts or challenging oneself with automatically generated assessments from specific cognitive levels (Remembering, Understanding, etc.), the student is given encouraging, personalized feedback as they master the curriculum.

---

## 🚀 Key Features

### 1. Modern & Interactive Dashboard
- **Sleek UI/UX**: Designed meticulously with React, featuring aesthetic modern designs, hover effects, and engaging micro-animations for a premium feel.
- **Real-Time Mastery Visualization**: Circular progress indicators give an immediate glance into a student's mastery of specific learning objectives and lessons.

### 2. Syllabus-Constrained AI Chatbot (RAG System)
- **Context-Aware Assistance**: Instead of generic responses, the AI tutor uses **Retrieval-Augmented Generation (RAG)** leveraging **ChromaDB**. It retrieves text from ingested curriculum PDF materials, ensuring all explanations are strictly aligned with the student's syllabus.
- **Conversational Memory**: The chatbot holds multi-turn conversational capabilities using context-aware querying.

### 3. Dynamic Assessments & Explanatory Feedback
- **AI-Powered Question Engine**: Generates unique questions targeted at specific cognitive levels (`Remember`, `Understand`, etc.).
- **Smart Remediation**: When a student answers incorrectly, the AI compares the answer to the correct conceptual point using Semantic Similarity. It identifies specific misconceptions, tells the student what they did right, what was wrong, and provides an encouraging explanatory hint.

### 4. Progress Tracking & Mastery Algorithm
- Tracks individual performance comprehensively down to the smallest "Learning Objective" (LO).
- Mastery scores adapt based on the accuracy of submissions and attempts over time, encouraging mastery learning rather than one-time success.

### 5. Secure User Accounts
- Built-in multi-user capabilities, securing personal data and individual progress streams utilizing encrypted password hashing (`passlib/bcrypt`) and JSON Web Token (JWT) based authentication.

---

## 🏗️ Architecture

The platform follows a decoupled, production-grade API-driven architecture that separates the UI presentation from AI routing and persistent data management. 

### Backend (FastAPI)
The backend is a high-performance Python application relying on **FastAPI**, structurally divided into purpose-built modules:
- **Routes Layer**: Modularized APIs for `auth`, `chat`, `progress`, and `tutor` endpoints.
- **Agent System**: Specialized controller modules handling complex AI logic, including `chat_agent.py`, `content_agent.py`, `question_agent.py`, and `assessment_agent.py`.
- **RAG & LLM Services**: Integrated with the **OpenRouter API** to orchestrate large language models (such as `qwen/qwen3.6-plus`). Uses **PyPDF** to extract text from materials and embeds them into **ChromaDB** for fast semantic vector search capabilities.
- **Database ORM**: Utilizes **SQLAlchemy** connected to PostgreSQL. The schema maps entities for `Users`, `Lessons`, `LearningObjectives`, `Progress`, and `Submissions` linking curriculum structure to student activity seamlessly.

### Frontend (React + Vite)
- **Framework**: Built with **React** running on the lightning-fast **Vite** build engine.
- **Design System**: Employs vanilla CSS for granular styling control, delivering vibrant layouts without rigid CSS framework constraints.
- **State & Routing**: Uses `React Router` for secure client-side routing (e.g., `ProtectedRoute` components) and native Context API for centralized authentication state. 

---

## 🚢 Deployment Stack

The whole stack was engineered with modern cloud deployment in mind, leveraging specialized PaaS providers for each architectural tier:

1. **Frontend Hosting — Vercel**: The React/Vite front end is hosted on Vercel at `https://ict-tutor-ai.vercel.app/` giving edge-cached lightning-fast load times globally.
2. **Backend API — Render**: The FastAPI environment is deployed on Render, running the Python uvicorn server seamlessly acting as the compute engine and LLM interface.
3. **Database — Supabase**: Persistent storage relies on Supabase, giving robust PostgreSQL hosting for complex user schemas, student sessions, and relational learning data.

---

## 💻 Running the App Locally

To spin up the project on your local machine:

### Backend Setup
1. Navigate to the `backend/` directory.
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   ```
3. Set your environment variables in a `.env` file (Database URI, OpenRouter API Key, etc.)
4. Seed the database (`python seed.py`) if not automatically populated.
5. Start the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
