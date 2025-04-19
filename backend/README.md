# FastAPI Backend

## Setup

1. Copy `.env.example` → `.env` and fill in your `OPENAI_API_KEY`.
2. Install deps:
   ```bash
   pip install -r requirements.txt
   ```
3. Run dev server:
   ```bash
   uvicorn app.main:app --reload
   ```

## API

POST `/api/query`
- Body: `{ "question": "..." }`
- Response: `{ "answer": "..." }`
