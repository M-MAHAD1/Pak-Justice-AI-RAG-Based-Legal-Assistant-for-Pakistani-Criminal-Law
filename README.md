

markdown
# ⚖️ Pak Justice AI Assistant

<div align="center">

**A State-of-the-Art RAG-based Legal Bot for Pakistani Criminal Law**

[![GitHub Stars](https://img.shields.io/github/stars/yourusername/pak-justice-ai?style=social)](https://github.com/yourusername/pak-justice-ai)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![Hugging Face](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Spaces-yellow)](YOUR_HUGGING_FACE_SPACE_LINK_HERE)

</div>

---

## 📖 Overview

**Pak Justice AI Assistant** is a cutting-edge **Retrieval-Augmented Generation (RAG)** platform designed to provide accurate, verified, and real-time legal assistance regarding Pakistani Criminal Law, specifically focusing on the **Pakistan Penal Code (PPC)** and the **Code of Criminal Procedure (CrPC)**.

The system leverages a modern **three-tier architecture** to deliver high-speed legal document retrieval, hybrid search capabilities (combining BM25 with Vector Embeddings), and an intelligent web-fallback mechanism for highly comprehensive answers.

---

## 🚀 Key Features

* **🔎 Hybrid Retrieval System:** Combines semantic vector search (Cosine Similarity) with traditional keyword matching (BM25) to achieve up to **98% accuracy**.
* **🤖 Advanced AI Core:** Powered by **Llama-3.1-8b-instant** for reasoning and inference, utilizing **gemini-embedding-001** for high-dimensional vector embeddings.
* **🌐 Web Fallback Mechanism:** Seamlessly integrated with the **Serper API** to fetch real-time legal data and updates when the local database lacks specific context.
* **🛡️ Security & Validation:** A custom Python-based query validator filters out out-of-scope or inappropriate prompts before processing.
* **📊 Administrative Dashboard:** Secure React-based portal allowing administrators to manage legal blogs, update content, and oversee document uploads.
* **💾 Dual-Database Architecture:** Uses **MongoDB** for web application/admin data and **ChromaDB** for efficient, low-latency vector storage.
* **🤗 Live Model Deployment:** The chatbot engine is hosted and accessible via Hugging Face Spaces for interactive public testing.

---

## 🏗️ System Architecture

The project is built using a decoupled **Three-Tier Architecture** to separate concerns and maximize performance:

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite + Tailwind CSS) | User Interface, Interaction & Chat Portal |
| **Web Backend** | Node.js + Express | Admin Panel Management, Authentication & Blog API |
| **AI Engine** | Python FastAPI | RAG Pipeline, Vector Search & LLM Orchestration |

---

## 🛠️ Tech Stack

### Frontend
* ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) **React.js (Vite)**
* ![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **Tailwind CSS**
* ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) **Axios**

### Backend & AI Engine
* ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white) **FastAPI (Python)**
* ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) **Node.js (Express)**
* ![LangChain](https://img.shields.io/badge/LangChain-121212?style=flat&logo=chainlink&logoColor=white) **LangChain Framework**

### Models & Databases
* ![Meta Llama](https://img.shields.io/badge/Llama_3.1-0467DF?style=flat&logo=meta&logoColor=white) **Llama 3.1 (Groq)**
* ![Google Gemini](https://img.shields.io/badge/Gemini-4285F4?style=flat&logo=google&logoColor=white) **Gemini Embeddings**
* ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) **MongoDB**
* ![ChromaDB](https://img.shields.io/badge/Database-FF6B6B?style=flat&logo=databricks&logoColor=white) **ChromaDB**

---

## 🌍 Demo & Deployment

The core conversational AI engine is deployed and ready for interaction:
> 🔗 **Try the Live Bot on Hugging Face:** [[Your Hugging Face Space Link Here](YOUR_HUGGING_FACE_SPACE_LINK_HERE)]

---

## 📋 Prerequisites

Before setting up the project locally, ensure you have the following installed:
* **Node.js** (v16 or higher)
* **Python** (v3.10 or higher)
* **MongoDB** (Local instance or MongoDB Atlas URL)
* **Git**
* API Keys for **Gemini**, **Groq (Llama)**, and **Serper**

---

## 💻 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone [https://github.com/yourusername/pak-justice-ai.git](https://github.com/yourusername/pak-justice-ai.git)
cd pak-justice-ai

```

### 2️⃣ Environment Configuration

Create `.env` files in their respective directories as specified below:

**📁 server/.env**

```env
MONGO_URI=your_mongodb_uri
PORT=5000
NODE_ENV=development

```

**📁 chatbot/.env**

```env
GEMINI_API_KEY=your_gemini_key
LLAMA_API_KEY=your_llama_key
SERPER_API_KEY=your_serper_key
CHROMA_DB_PATH=./chroma_db

```

### 3️⃣ Running the Application

To run the complete ecosystem locally, you will need **three separate terminals** running simultaneously:

#### 🖥️ Terminal 1: Web Backend (Node.js)

Manages the administrative panel, standard user authentication, and legal blogs.

```bash
cd server
npm install
npm run dev

```

#### 🤖 Terminal 2: Chatbot AI Engine (FastAPI)

Handles vector chunk retrieval, query validation, and live LLM logic.

```bash
cd chatbot

# Setup and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install requirements and start server
pip install -r requirements.txt
python main.py

```

#### 🌐 Terminal 3: Frontend (React.js)

The core client-facing user interface.

```bash
cd frontend
npm install
npm run dev

```

* Once running, the UI will be accessible locally at `http://localhost:5173`.

---

## 📊 System Metrics

| Metric | Target Value | Context / Notes |
| --- | --- | --- |
| **System Accuracy** | 98% | Evaluated at a `0.27` similarity threshold |
| **Local RAG Latency** | ~3.5s | Vector retrieval + Local LLM response generation |
| **Web Fallback Latency** | ~7.8s | Includes external live scraping via Serper API |
| **Knowledge Base** | 3,237 | Individual vectorized legal segments (PPC & CrPC) |

---

## 🗂️ Project Structure

```plaintext
pak-justice-ai/
├── 📁 frontend/           # React.js client application (Vite + Tailwind)
│   ├── src/
│   ├── public/
│   └── package.json
├── 📁 server/             # Node.js backend server (Admin panel & Blogs)
│   ├── routes/
│   ├── models/
│   └── package.json
├── 📁 chatbot/            # Python FastAPI engine (RAG pipeline)
│   ├── main.py
│   ├── rag_pipeline.py
│   └── requirements.txt
└── README.md

```

---

## 👥 Development Team & Acknowledgments

This project was developed as a **Final Year Project (FYP)** at **Khwaja Fareed University of Engineering and Information Technology (KFUEIT)**.

* **Muhammad Mahad** - Lead Developer (Computer Science Undergraduate)
* **Ashir Akram** - Project Teammate

### 🎓 Project Supervision

We express our deepest gratitude to our project supervisor, **Dr. Shahzad Husain**, for his invaluable guidance, continuous academic support, and constructive architectural feedback throughout the development cycle.

### 🏛️ Acknowledgments

* **KFUEIT** for providing resources and academic infrastructure.
* **LangChain** for providing the foundational tools to engineer robust RAG architectures.
* **Meta & Google** for lowering boundaries with open-weights and accessible LLMs/embeddings models.

```

---
*Note: Jab aap apni repository update karein, toh bas upar diye gaye markdown code mein `YOUR_HUGGING_FACE_SPACE_LINK_HERE` ko apne real link se replace kar dijiyega.*

```
