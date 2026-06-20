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
