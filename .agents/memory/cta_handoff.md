# Handoff: BEVAMPED CTA & Qualification Gate Strategy

## 1. Context & Objective
We are moving into the final phase of the BEVAMPED desktop website build: **The CTA (Call to Action) and Booking Experience.** The goal is to design an interaction that feels as premium, exclusive, and high-end as the brutalist architecture of the site itself.

## 2. The Reference (Goodfellas)
Goodfellas uses a highly effective interaction:
*   **The Trigger:** A sticky "Let's Work Together" button.
*   **The Action:** Clicking it does *not* redirect to a new page (which is jarring). Instead, it opens a sleek, dark-mode calendar modal over a blurred background.
*   **The Tool:** They use [Cal.com](https://cal.com/), an open-source alternative to Calendly that allows for total visual customization and pure white-labeling.

## 3. The Proposed Upgrade: "The Qualification Gate"
While Goodfellas' modal is beautiful, dropping a naked calendar link implies that anyone can book your time. For a high-ticket, luxury service, **friction is a feature**. 

**The Qualification Flow:**
1.  **The Click:** User clicks "Let's Work Together".
2.  **The Gate:** A dark-mode modal opens, but instead of a calendar, it presents a highly-designed, 3-question micro-form. 
    *   *Example:* "What is the primary scope?" → "What is your timeline?" → "What is the project budget tier?"
3.  **The Reveal:** Only after answering does the calendar (Cal.com) smoothly slide into view.

**Why this works:** It signals authority. It says, *"We are busy, and you must qualify to speak with our architects/designers."* It pre-qualifies leads, saving you time.

## 4. Open Questions for the Next Session
In the new chat window, you and the agent must finalize the implementation path. Use this document as your starting point to explore:

> [!NOTE]
> **Research Directives for the Next Agent:**
> 1.  **Form Tooling:** Should we build a custom HTML/JS micro-form, or embed a dark-themed Typeform / Tally.so?
> 2.  **Calendar Integration:** Confirm Cal.com's modal embedding capabilities. How do we pass the form data into the Cal.com booking notes automatically?
> 3.  **AI Alternatives:** Are there emerging AI scheduling agents that provide an even more premium experience than standard calendar booking? Conduct a quick web search to see what luxury concierge tech exists in 2026.
> 4.  **Mobile Polish:** The CTA button behavior and modal scaling must be flawless on mobile screens.

---
*Copy the contents of this document or attach this file to your next chat window to instantly align the agent with our strategic direction.*
