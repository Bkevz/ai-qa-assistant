from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from app.schemas.query import QueryRequest, QueryResponse
from app.services.llm_client import LLMClient
import logging

router = APIRouter()

@router.post("", response_model=QueryResponse)
async def ask(request: QueryRequest):
    try:
        answer = await LLMClient().get_answer(request.question)
        return QueryResponse(answer=answer)
    except Exception as e:
        logging.error(f"Error in ask endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch answer")

@router.post("/stream")
@router.get("/stream")
async def ask_stream(request: QueryRequest = None, question: str = None):
    try:
        # Get question from either POST body or GET query param
        question_text = question if question else (request.question if request else "")
        
        async def event_generator():
            async for text_chunk in LLMClient().get_stream_answer(question_text):
                if text_chunk:
                    yield f"data: {text_chunk}\n\n"

        return StreamingResponse(
            event_generator(),
            media_type="text/event-stream",
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no',
            }
        )
    except Exception as e:
        logging.error(f"Error in stream endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to stream answer")
