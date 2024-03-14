import datetime
import codecs
import pypandoc
from fastapi import Depends, FastAPI, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from pathlib import Path

app = FastAPI()

# Directory to save the converted files
OUTPUT_DIR = 'converted_files'
Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)


class MarkdownRequest(BaseModel):
    md: str


def md2pptx(md: str) -> str:
    date = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    filename = f'markdown-{date}.pptx'
    output_path = Path(OUTPUT_DIR) / filename
    pypandoc.convert_text(md, 'pptx', format='md', outputfile=output_path)
    return filename


@app.post("/md2pptx")
def convert_md2pptx(request: MarkdownRequest):
    request.md = codecs.decode(request.md, 'unicode_escape')
    try:
        filename = md2pptx(request.md)
        return FileResponse(Path(OUTPUT_DIR) / filename, media_type='application/vnd.openxmlformats-officedocument.presentationml.presentation', filename=filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)