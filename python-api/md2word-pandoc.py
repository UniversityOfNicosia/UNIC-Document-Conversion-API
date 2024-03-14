import datetime
import codecs
import pypandoc
from fastapi import Depends, FastAPI, Form, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pathlib import Path

app = FastAPI()

# Directory to save the converted files
OUTPUT_DIR = 'converted_files'
Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)


class MarkdownRequest(BaseModel):
    md: str


# Converts markdown string to a docx file and returns the filename
def md2word(md: str) -> str:
    print(f"Content passed to pypandoc:\n{md}")
    date = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    filename = f'markdown-{date}.docx'
    output_path = Path(OUTPUT_DIR) / filename
    pypandoc.convert_text(md, 'docx', format='md', outputfile=output_path)
    return filename


@app.post("/markdown_to_docx/")
async def markdown_to_docx(request: MarkdownRequest):
    request.md = codecs.decode(request.md, 'unicode_escape')
    try:
        filename = md2word(request.md)
        return FileResponse(Path(OUTPUT_DIR) / filename, media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document', filename=filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)