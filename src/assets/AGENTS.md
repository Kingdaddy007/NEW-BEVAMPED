# src/assets Context & Contract

## 1. Purpose
This directory contains small project-specific static branding icons and symbols imported directly into stylesheet configurations or TS files.

## 2. Rules & Constraints
- **Resource Boundary**: Limit assets stored here to lightweight files (SVGs, small PNGs). Large luxury video clips or high-resolution images must be placed under `/public/`.

## 3. Exposed Interfaces
- `hero.png`: Backdrop visual for hero transitions.
- `typescript.svg`: Logo symbol.
- `vite.svg`: Bundler environment logo symbol.

## 4. Internal Dependencies
- None.

## 5. Verification
- Verify that the total directory size remains small (under 5MB).
