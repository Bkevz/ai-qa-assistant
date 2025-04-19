# AI Q&A Assistant

A modern, secure, and well-documented full-stack web application that serves as an interactive AI Q&A assistant.

## 🔧 Project Overview

This application allows users to ask questions via a clean, modern interface and receive answers from an AI language model. The application is built with a FastAPI backend and a Next.js frontend.

### Features

- Clean, modern UI with Tailwind CSS
- Real-time streaming responses from the AI
- Dark mode toggle
- Chat history saved in localStorage
- Responsive design

## 📁 Project Structure

```
root/
├── frontend/            # Next.js + TailwindCSS
│   ├── pages/           # Next.js pages
│   ├── components/      # React components
│   │   ├── QueryForm.tsx
│   │   ├── ResponseDisplay.tsx
│   │   └── DarkModeToggle.tsx
│   ├── styles/          # CSS styles
│   └── .env             # Frontend environment variables
│
├── backend/             # FastAPI app
│   ├── app/
│   │   ├── main.py      # FastAPI application entry point
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── schemas/     # Pydantic models
│   ├── .env             # Backend environment variables
│   └── requirements.txt # Python dependencies
```

## 🚀 Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file based on `.env.example` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

6. Run the backend server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the backend URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 API Documentation

Once the backend is running, you can access the API documentation at:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| OPENAI_API_KEY | Your OpenAI API key | Yes |
| HOST | Host to run the server on | No (default: 0.0.0.0) |
| PORT | Port to run the server on | No (default: 8000) |

### Frontend (.env.local)

| Variable | Description | Required |
|----------|-------------|----------|
| NEXT_PUBLIC_API_URL | URL of the backend API | Yes |

## 📋 Example Prompts

Here are some example prompts to try with the AI assistant:

- "What is the capital of France?"
- "Explain quantum computing in simple terms."
- "Write a short poem about technology."
- "What are the benefits of exercise?"
- "How does blockchain technology work?"

## 🧪 Optional Features

- **Dark Mode**: Toggle between light and dark themes with the sun/moon icon in the header.
- **Streaming Responses**: See the AI's response in real-time as it's being generated.
- **Chat History**: Your conversation history is saved in your browser's localStorage.
