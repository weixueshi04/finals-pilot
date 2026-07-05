---
name: chaoxing-materials
description: Download accessible course materials from Chaoxing/Learning通 for FinalsPilot or other study workflows. Use when a student has courseware inside 学习通/超星章节学习, especially when PPT/PDF files are embedded in chapter pages without a visible download button; supports browser login reuse, course and chapter navigation, objectid/status resolution, PDF/source-file download, output-folder naming, and manifest generation.
---

# Chaoxing Materials

Use this skill to help a student download course materials that are accessible in their own Chaoxing/Learning通 account.

## When To Use

Use this skill before FinalsPilot source coverage when:

- Courseware is inside Chaoxing/Learning通 chapter pages.
- PPT/PDF/DOC resources are embedded in the chapter view without a visible download button.
- The student wants a local folder that an installed agent can read reliably.
- FinalsPilot needs a manifest to know which courseware files exist, which files were downloaded, and which files failed.

Do not use it when the student already has a complete local folder of course materials, unless they want to fetch additional Chaoxing resources.

## Boundaries

- Only work with materials the student can access through their own logged-in course page.
- Do not ask for passwords. Open the browser and let the student log in manually when needed.
- Reuse the local browser profile at `automation/chaoxing/browser-profile` when available.
- Do not rely on the student's everyday Chrome/Edge profile. The automation profile is separate so login cookies and course artifacts stay local to this workflow.
- Do not install third-party browser extensions, download accelerators, or external download managers without explicit user approval.
- Do not bypass access controls, paywalls, CAPTCHA, school SSO restrictions, or account security prompts.
- Do not commit downloaded course materials, login profiles, extracted text, or generated course artifacts.

## Browser And Session Policy

Before opening Chaoxing, state the browser/runtime choices clearly:

```text
Browser:
- Executable: <Chrome/Edge path>
- Channel: auto / chrome / edge / explicit path
- Profile: automation/chaoxing/browser-profile or CHAOXING_USER_DATA_DIR
- Extensions: profile default / disabled-by-env / user-approved helper
- Download engine: direct fetch / browser native download / user-approved helper
```

Rules:

- Chrome and Edge are both supported because both expose Chromium automation. There is no courseware-download advantage to either browser.
- The default search order is Chrome first, then Edge. Use `CHAOXING_BROWSER_CHANNEL=edge` to prefer Edge, `CHAOXING_BROWSER_CHANNEL=chrome` to prefer Chrome, or `CHAOXING_BROWSER=<absolute-browser-exe>` to pin a specific browser.
- Login persistence is tied to the automation profile, not the user's normal browser profile. If the browser executable or `CHAOXING_USER_DATA_DIR` changes, the student may need to log in once again.
- Keep using the same browser executable and same automation profile during one course run.
- Run `npm.cmd run chaoxing:login` as a session check. If the session is already valid, do not ask the student to log in again.
- If Chaoxing asks for login twice, explain the likely cause: expired SSO session, school SSO domain requiring a separate confirmation, changed browser/profile, cleared cookies, or Chaoxing invalidating the previous session. Do not claim the profile was preserved unless the session check proves it.
- Browser extensions follow the chosen automation profile by default. If an extension interferes, ask before rerunning with `CHAOXING_DISABLE_EXTENSIONS=1`.

## Download Engine Policy

- Choose the download route from the user's actual environment and state the choice before downloading.
- Preferred portable route: direct fetch from Chaoxing/Chaoxing CDN URLs using the logged-in browser cookies.
- Browser native download is an acceptable fallback when direct fetch fails or when Chaoxing only exposes a normal download link.
- Existing third-party helpers such as Xunlei, IDM, browser download plugins, or cloud-drive helper extensions may be used only when the user already has them configured, the agent explains the tradeoff, and the user approves that route for the current run.
- Never silently install or enable a third-party helper.
- Regardless of route, verify downloaded PDFs by checking the `%PDF` file header. If a file is HTML, JSON, video, or an error page, record it as failed/partial instead of adding it to the manifest.

## Format Policy

Default to `pdf` for PPT/PPTX/DOC/DOCX/XLS/XLSX resources:

- PDF is the default AI-reading copy. It usually gives GPT/Claude-style agents stable page references, visual layout, and text extraction while saving space.
- Do not download source PPT/PPTX/DOCX/XLSX by default. Use `--mode source` only when the teacher's original file matters, the PDF is broken, or the student explicitly wants original files.
- Do not download video/audio by default. Use `--mode media` only when the student explicitly wants recordings, or when the course has no document material and the video/audio is needed for review.
- Use `--mode all` only when the student explicitly wants every accessible resource and accepts the storage/time cost.
- If the downloaded PDF is incomplete, visually broken, or missing important notes/animations, rerun with `--mode source` and ask the agent to extract/convert the source file with document tools.

## Required Student Setup

Before downloading, ask the student where the course materials should be saved. This is a hard gate: do not start downloading until the user has approved a folder path.

Use a generic placeholder in public instructions and ask the student to provide their own local path during an actual run:

```text
<course-materials-folder>
```

Use that folder as the `--output` path or `CHAOXING_OUTPUT_DIR`.

If the user does not provide a folder, stop and ask for one. Do not silently fall back to `automation/chaoxing/downloads` or another default folder.

Recommended folder layout:

```text
course-materials/
  01_pdf_for_ai/
  02_source_files/      # optional
  03_video_audio/       # optional
  manifest/
```

Naming and privacy rules:

- Preserve meaningful Chaoxing file names when available, but do not write real student course names, local paths, or downloaded file names into the skill documentation.
- In public examples, use placeholders such as `<original-courseware-name>.pptx` and `<original-courseware-name>.pdf`.
- For PDF conversions, keep the same base name and use `.pdf`.
- If files collide, append `(2)`, `(3)`, etc. Do not overwrite silently.
- Keep `materials-manifest.json` and `materials-manifest.md` so FinalsPilot can trace each file by relative path, objectid, download mode, and bytes.
- Do not write absolute local paths, signed download URLs, real course names, or account identifiers into public docs or reusable skill examples.
- Treat manifests, downloaded files, login profiles, and temporary output folders as private runtime artifacts. They belong in ignored local folders, not in the public repository.

## Output Contract

A successful run creates or updates this folder layout:

```text
<course-materials-folder>/
  01_pdf_for_ai/
  02_source_files/      # optional, only when source mode is used
  03_video_audio/       # optional, only when media mode is used
  manifest/
    materials-manifest.md
    materials-manifest.json
```

Manifest privacy rules:

- Record relative paths, not absolute local paths.
- Do not record signed download URLs, cookies, tokens, account identifiers, or school SSO details.
- Keep enough metadata for FinalsPilot to trace coverage: filename, type/mode, objectid when available, bytes, relative path, and download timestamp.
- If a file fails, record the failure in the user-facing summary and ask FinalsPilot to mark the item as unreadable or partial.

## Workflow

1. Confirm the student has created or approved an output folder. Show the exact folder path back to the student before downloading.
2. Install local automation dependencies if missing:

   ```powershell
   npm.cmd install
   ```

3. State the browser/profile/download-engine runtime and check the login session:

   ```powershell
   npm.cmd run chaoxing:login
   ```

   If the existing automation profile is still logged in, continue without asking the student to log in manually.

4. Scan course list:

   ```powershell
   npm.cmd run chaoxing:courses
   ```

5. Open the target course and chapter:

   ```powershell
   npm.cmd run chaoxing:open-section -- <课程关键词> <章节关键词>
   ```

6. Probe the page when the resource structure is unknown:

   ```powershell
   npm.cmd run chaoxing:probe-assets
   ```

7. Download the current chapter document:

   ```powershell
   npm.cmd run chaoxing:download-current -- --output "<course-materials-folder>"
   ```

   This defaults to PDF-only. Use `npm.cmd run chaoxing:download-source` for source files, `npm.cmd run chaoxing:download-media` for video/audio, and `npm.cmd run chaoxing:download-all` only when the student explicitly wants everything.

   If `--output` or `CHAOXING_OUTPUT_DIR` is missing, the script must stop and ask for a folder instead of using an implicit default.

8. Verify each downloaded file:

   - Check file size is nonzero.
   - For PDF, verify the first bytes start with `%PDF`.
   - For PPTX/DOCX/XLSX, verify the first bytes start with `PK`.
   - If the file is HTML, JSON, or an error page, do not mark it complete.

9. Summarize the result:

   ```text
   Downloaded:
   - PDF files: <count>
   - Source files: <count or skipped>
   - Media files: <count or skipped>
   - Manifest: <course-materials-folder>/manifest/materials-manifest.md
   Failed or partial:
   - <resource or none>
   Next:
   - Hand this folder to FinalsPilot and seed source coverage from the manifest.
   ```

10. Hand off the output folder and manifest to FinalsPilot as course materials.

## Implementation Notes

- The robust route is usually the resource metadata/status endpoint plus verified direct fetch, but the agent may choose browser-native or user-approved helper downloads when the page structure requires it.
- First locate resource iframes inside `.ans-attach-ct` or the knowledge-card frame.
- Extract `objectid` from iframe attributes or URLs.
- Resolve resource metadata through:

  ```text
  https://mooc1.chaoxing.com/ananas/status/<objectid>?flag=normal
  ```

- Use returned fields:

  | Field | Meaning |
  |---|---|
  | `filename` | Original meaningful file name |
  | `download` | Original source-file download when available |
  | `pdf` | Chaoxing PDF conversion for document/courseware |
  | `http` | Media stream or readable resource URL |
  | `length` | Expected resource size |
  | `pagenum` | Document page count when available |

## FinalsPilot Handoff

After download, tell FinalsPilot:

```text
Use this folder as course material input: <CHAOXING_OUTPUT_DIR>
Use manifest/materials-manifest.md/json as the source coverage seed.
Treat 01_pdf_for_ai/ as the default AI-reading input. Treat 02_source_files/ and 03_video_audio/ as optional evidence only when present.
```

If a high-priority teacher review file or chapter resource fails to download, record it as unreadable/partial in FinalsPilot `logs/source_coverage.md` instead of pretending it was read.

Recommended FinalsPilot source-coverage mapping:

| Chaoxing output | FinalsPilot meaning |
|---|---|
| `manifest/materials-manifest.json` | First source list and coverage seed |
| `01_pdf_for_ai/` | Default readable courseware input |
| `02_source_files/` | Optional original-file evidence when PDFs are incomplete |
| `03_video_audio/` | Optional recording/media evidence; requires transcription before S1/S2 use |
| Failed downloads | `unreadable` or `partial`, with user action needed |

## Failure Handling

- If login is expired, rerun `npm.cmd run chaoxing:login` and let the student authenticate manually.
- If login is requested again after a previous successful login, check whether the browser executable, `CHAOXING_USER_DATA_DIR`, school SSO domain, or cookie state changed before asking the student to retry.
- If the user normally uses Edge but automation used Chrome, either continue with the isolated Chrome profile after one login, or rerun with `CHAOXING_BROWSER_CHANNEL=edge` so future sessions stay in Edge.
- If course or chapter search returns the wrong page, ask for narrower course/chapter keywords.
- If no resource objectid is found, run `npm.cmd run chaoxing:probe-assets` and inspect iframe/card metadata before guessing.
- If the PDF conversion is missing or broken, use `--mode source` for the original file, then let FinalsPilot's document tools convert or read it.
- If the resource is video/audio and the student needs it for review, use `--mode media`; FinalsPilot must still transcribe it before treating it as teacher evidence.
- If a third-party extension or download helper opens, explain what happened and ask whether to use it, ignore it, or rerun with `CHAOXING_DISABLE_EXTENSIONS=1`.
