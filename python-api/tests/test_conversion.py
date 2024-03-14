"""
This module contains tests for converting Markdown to DOCX and PPTX formats.
"""
from app.conversion_logic import md2pptx, md2word
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_endpoint_markdown_to_docx():
    """
    Test case for converting Markdown to DOCX.

    Sends a POST request to the '/markdown_to_docx/' endpoint with a Markdown content.
    Asserts that the response status code is 200 and content-type is correct.
    """
    response = client.post(
        "/markdown_to_docx/",
        json={"md": "# Hello, World!"}
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == (
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )

def test_endpoint_markdown_to_pptx():
    """
    Test case for converting Markdown to PPTX.

    Sends a POST request to the '/markdown_to_pptx/' endpoint with a sample Markdown content.
    Asserts that the response status code is 200 and content-type is correct.
    """
    response = client.post(
        "/markdown_to_pptx/",
        json={"md": "# Hello, World!"}
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == (
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )

def test_markdown_to_docx():
    """
    Test case for converting Markdown to DOCX using the md2word function in conversion_logic.py.

    Calls the md2word function with a sample Markdown content.
    Asserts that the function returns a valid filename.
    """
    from app.conversion_logic import md2word
    filename = md2word("# Hello, World!")
    assert filename.endswith(".docx")

def test_markdown_to_pptx():
    """
    Test case for converting Markdown to PPTX using the md2pptx function in conversion_logic.py.

    Calls the md2pptx function with a sample Markdown content.
    Asserts that the function returns a valid filename.
    """
    from app.conversion_logic import md2pptx
    filename = md2pptx("# Hello, World!")
    assert filename.endswith(".pptx")
