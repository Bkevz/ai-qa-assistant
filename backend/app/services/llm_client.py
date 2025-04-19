import os
import httpx
import json
import logging

class LLMClient:
    def __init__(self):
        raw_key = os.getenv("OPENAI_API_KEY", "")
        # strip surrounding quotes if present
        self.api_key = raw_key.strip().strip('"')
        self.api_url = "https://api.openai.com/v1/chat/completions"

    async def get_answer(self, prompt: str) -> str:
        headers = {"Authorization": f"Bearer {self.api_key}"}
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": prompt}]
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(self.api_url, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"].strip()
            
    async def get_stream_answer(self, prompt: str):
        headers = {"Authorization": f"Bearer {self.api_key}"}
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": prompt}],
            "stream": True
        }
        
        async with httpx.AsyncClient() as client:
            async with client.stream("POST", self.api_url, json=payload, headers=headers) as response:
                response.raise_for_status()
                buffer = ""
                
                async for chunk in response.aiter_text():
                    lines = [line for line in chunk.split('\n') if line]
                    
                    for line in lines:
                        if line.startswith('data: ') and line != 'data: [DONE]':
                            try:
                                json_str = line[6:] # Remove 'data: ' prefix
                                if json_str.strip():
                                    # Handle the case where the chunk might be incomplete JSON
                                    try:
                                        data = json.loads(json_str)
                                        if 'choices' in data and len(data['choices']) > 0:
                                            delta = data['choices'][0].get('delta', {})
                                            if 'content' in delta:
                                                content = delta['content']
                                                buffer += content
                                                yield content
                                    except json.JSONDecodeError:
                                        # Skip incomplete chunks, they'll be completed in the next iteration
                                        logging.debug(f"Skipping incomplete JSON chunk")
                                        pass
                            except Exception as e:
                                logging.error(f"Error parsing chunk: {e}")
                                continue
                        
                        if line == 'data: [DONE]':
                            break
