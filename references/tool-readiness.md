# Tool Readiness and Auto-Install

Use this reference when University Finals Sprint receives files that the current agent cannot confidently read yet.

## Principle

The agent should not stop at "I cannot read this file." It should:

1. Identify the material types.
2. Explain which capability is missing and why it matters for the exam run.
3. Prefer built-in, bundled, or agent-native tools.
4. Install or enable the missing tool when the platform allows it.
5. Smoke-test extraction on a representative file.
6. Record the result in `logs/tool_readiness.md` and mirror unreadable sources in `logs/source_coverage.md`.

If installation is blocked by policy, network, package manager, sandbox, OS permission, or missing credentials, ask for the minimum approval once. If it still fails, request a user export/transcript/skip/lower-confidence continuation.

## Preferred Capability Map

| Source type | Needed capability | Preferred path | Fallback |
|---|---|---|---|
| PDF | Text extraction, page references, image/page fallback | Built-in document/PDF tool; bundled PDF parser; local `pdftotext`, PDF.js, PyMuPDF, or pdfplumber | Ask for extracted text or key pages |
| PPT/PPTX | Slide text, speaker notes, slide numbers, embedded images | Built-in document tool; LibreOffice/Office export to PDF/images/text; python-pptx for text | Ask for exported PDF/images/text |
| DOCX | Paragraph/table extraction | Built-in document tool; mammoth; python-docx | Ask for pasted text or exported PDF |
| Images/homework photos | Vision/OCR with layout awareness | Agent vision plugin; OCR tool such as PaddleOCR/Tesseract when appropriate | Ask for clearer images or transcription |
| Audio/video review recordings | Transcription with timestamps | Agent transcription tool; Whisper/faster-whisper; user-approved transcription service/export | Ask for transcript or key timestamps |
| XLSX/CSV | Spreadsheet parser and formulas/values | Built-in spreadsheet tool; SheetJS, openpyxl, LibreOffice export | Ask for CSV export or screenshots plus OCR |
| ZIP/7Z/RAR | Archive extraction | Built-in archive support; OS archive tools; 7-Zip if available | Ask the user to unpack |
| Web pages | Browser/search with citation | Agent browser/search tool | Ask for URL text or screenshots |
| Local course folder | Filesystem read/write | Installed/file-based agent workspace | Switch to a file-based agent or accept unsupported manual run |

## Student-Facing Install Notice

Use a short notice before installation:

```markdown
Tool readiness:
- Found: 8 PPTX, 2 PDF, 1 WAV, 12 homework photos
- Missing: audio transcription and OCR
- Need to install/enable: <tool names>
- Why: the WAV review recording is S1 teacher evidence; homework photos are exam-style sources
- Action: installing/enabling now; I will run a small extraction test before marking them readable
```

## Installation Boundaries

- Do not install unknown packages without a clear material-reading need.
- Do not install paid or credential-requiring tools unless the user explicitly chose that path.
- Do not use web/general knowledge as a replacement for unread course materials.
- Do not mark a source complete merely because a parser ran; inspect extraction quality, page/slide coverage, and obvious garbling.
- When a tool produces partial output, mark the source partial and state what remains unread.

## Smoke Tests

Run the smallest useful test before continuing:

- PDF: extract 1-2 pages and confirm text is readable with page numbers.
- PPT/PPTX: extract slide titles/body text and confirm slide numbers are preserved.
- DOCX: extract paragraphs and tables.
- Image: OCR one clear homework/photo sample and compare visible text.
- Audio: transcribe 30-60 seconds and confirm language, timestamps, and speaker/review emphasis are usable.
- Spreadsheet: read one bounded range with headers and formulas/values as needed.

Only after a smoke test passes should the source be marked as readable in `logs/source_coverage.md`.
