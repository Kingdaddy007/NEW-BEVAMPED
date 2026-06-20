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
