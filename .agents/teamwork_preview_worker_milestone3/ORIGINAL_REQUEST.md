## 2026-06-15T10:05:45Z
Objective:
Create the following files in the project workspace:
1. `public/AGENTS.md`
2. `contexts/AGENTS.md`
3. `scratch/AGENTS.md`
4. `research results/AGENTS.md`

Instructions:
- Write each file using the DOX Template format (Purpose, Rules & Constraints, Exposed Interfaces, Internal Dependencies, Verification).
- Make sure to ONLY write these documentation files. DO NOT write, modify, or delete any source code files (TypeScript, JavaScript, CSS, HTML, config files, etc.).

Detailed Content for C:\Users\godsw\.gemini\antigravity\worktrees\001\map-dox-framework-contracts\public\AGENTS.md:
---
# public Context & Contract

## 1. Purpose
This directory serves as the root host folder for high-resolution static media assets, custom video loops, icons, and fonts loaded dynamically by HTML or CSS paths.

## 2. Rules & Constraints
- **Reference Constraint**: Assets in this directory are served at the root URL path (e.g., `/videos/lifestyle_1.mp4`). Always reference them with absolute URLs from the web root.
- **Format Rule**: Video loops should be optimized in MP4 format with appropriate compression to balance visual luxury and page load performance.

## 3. Exposed Interfaces
- `/videos/lifestyle_1.mp4`: Placeholder video loop for storytelling testimonials.
- `/videos/lifestyle_2.mp4`: Placeholder video loop for storytelling testimonials.
- `/videos/`: Folder containing other MP4 cinematic background loops.
- `/images/`: Folder holding static photo materials.
- `/icons.svg`: SVG icon sprite sheet.
- `/favicon.svg`: Icon manifest symbol.

## 4. Internal Dependencies
- None.

## 5. Verification
- Verify that asset paths are valid by ensuring files return 200 OK under local Vite dev server.
---

Detailed Content for C:\Users\godsw\.gemini\antigravity\worktrees\001\map-dox-framework-contracts\contexts\AGENTS.md:
---
# contexts Context & Contract

## 1. Purpose
This directory acts as the central diagnostic logs repository for the project, tracking existing visual issues, accessibility audits, and critique feedback.

## 2. Rules & Constraints
- **No Implementation Rule**: No code files (JS/TS/CSS) should be created in this directory. It is reserved for documentation and diagnostic reports.

## 3. Exposed Interfaces
- `audit-issues.md`: Record of layout, scaling, and contrast issues.
- `critique-issues.md`: Detailed audit of user experience and interactive scroll issues.

## 4. Internal Dependencies
- None.

## 5. Verification
- Ensure documents conform to markdown syntax rules.
---

Detailed Content for C:\Users\godsw\.gemini\antigravity\worktrees\001\map-dox-framework-contracts\scratch\AGENTS.md:
---
# scratch Context & Contract

## 1. Purpose
This directory is an isolated sandbox workspace for developing offline parsing scripts, testing prototype animations, and analyzing output logs.

## 2. Rules & Constraints
- **Isolation Rule**: Production files (`src/`) must never import or depend on files located in this directory.
- **Cleanliness Rule**: Temporary logs and scripts created during exploration must not be compiled or shipped in release builds.

## 3. Exposed Interfaces
- `sandbox.html`: Isolated prototype page for testing experimental features.
- `parse_haven.py`: Python utility for scrubbing input files.
- `cleaned_haven.txt`: Cleaned data dump.

## 4. Internal Dependencies
- None.

## 5. Verification
- Ensure that the folder path is ignored or excluded in `vite.config.ts` and `tsconfig.json`.
---

Detailed Content for C:\Users\godsw\.gemini\antigravity\worktrees\001\map-dox-framework-contracts\research results\AGENTS.md:
---
# research results Context & Contract

## 1. Purpose
This directory stores comprehensive motion design research archives, library documentation, and references regarding GSAP easing and scroll animations.

## 2. Rules & Constraints
- **No Execution Rule**: This directory is strictly read-only reference documentation. No scripts or runnable files should reside here.

## 3. Exposed Interfaces
- `gemini 3.1 pro Elite Motion Design Research Library.md`: Reference documentation for luxury motion curves and easing doctrines.

## 4. Internal Dependencies
- None.

## 5. Verification
- Ensure documents conform to standard markdown layout templates.
---

Verify all files exist before finishing, then send a message back.
