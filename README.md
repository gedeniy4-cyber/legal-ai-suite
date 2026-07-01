# Chambers OS

**The AI Operating System for Modern Legal Professionals**

An AI powered productivity platform built for law students, candidate attorneys, paralegals, attorneys, advocates, and corporate legal teams. Built for the CAPACITI AI Skills Acceleration Programme, Week 3: AI Powered Workplace Productivity Assistant.

---

## Problem Statement

Legal professionals and law students lose significant time to tasks that do not require legal judgement: drafting correspondence, summarising meetings, planning deadlines, and locating a starting point for research. General AI tools are not tailored to legal workflows and do not present output in a form that is immediately usable in legal practice or study.

## Solution Overview

Chambers OS is a single AI powered dashboard for legal work, not a set of disconnected tools. Every feature shares one login, one AI service, and one design system.

**Core features**
- **Legal Email Generator**: recipient, matter, purpose, and tone in, editable correspondence out.
- **Meeting Summarizer**: notes or files in, executive summary, action items, and deadlines out.
- **AI Task Planner**: tasks and deadlines become a prioritised schedule.
- **Legal Research Assistant**: research question and jurisdiction in, summary and authorities out.
- **AI Legal Chat**: persistent, legal focused conversation with history and a Plus attachment control beside the prompt box.

**Premium features**: Contract Review, Legal Document Explainer, Case Timeline Generator, Court Preparation Assistant, Citation Formatter, Argument Builder, Legal Writing Coach.

**Subscription tiers (ZAR)**
- Basic (R0): 10 AI requests a day, Email Generator, Meeting Summarizer, limited Chat.
- Pro (R299): everything in Basic, unlimited requests, Task Planner, Research Assistant, history and analytics.
- Premium (from R699): everything in Pro, advanced drafting, contract review, citation generation, priority AI.

Guest mode is fully functional and unlimited, with no account required.

## Attachments and Input

Every AI feature accepts attachments through a Plus control next to the prompt box: PDF, DOCX, TXT, and images, plus pasted URLs and links from Google Drive, OneDrive, and Dropbox. Uploaded files are read and understood by the AI service, not just stored. Attachment count and prompt length are both uncapped. For long form output, users can set a target word count so the AI generates essays or documents at the length they choose.

## Architecture

- **Frontend**: React, component based, shared layouts, cards, forms, and modals, fully responsive.
- **AI service layer**: one reusable service function handles every feature. Prompts are stored separately from the UI, so the provider (currently OpenAI) can be swapped without rewriting the app.
- **Authentication**: email login, registration, forgot password, Google and Microsoft sign in, protected routes, and full guest access.
- **Usage tracking**: daily AI requests are tracked per tier and reset daily. Reaching a limit disables generation and shows an upgrade prompt.
- **Data**: every new account starts at zero. History and analytics populate only from real activity.

## Tools and Technologies Used

- **Lovable AI**: built the working application from a structured specification.
- **ChatGPT**: drafted and refined the prompt engineering behind the build.
- **OpenAI API**: the configured AI provider for the backend service layer.
- **GitHub**: version control and submission.
- **React**: frontend architecture.

## Sample Prompt

> Build a production ready, responsive SaaS application called Chambers OS, an AI powered platform for legal professionals. Every button, form, and page must work. Every AI feature must call one shared, reusable AI service, with prompts stored separately from the UI. Support unlimited attachments and unlimited prompt length, with the AI able to read and respond to uploaded documents. Include a subscription system in South African Rand that genuinely enables and disables features, a fully functional and unlimited guest mode, and a responsible AI disclaimer on every AI page.

The full build prompt is in `lovable-prompt.md`.

## Challenges and Solutions

- **Keeping every AI feature consistent**: routed all tools through one shared AI service with prompts kept in a separate library.
- **Subscription tiers that do more than change colour**: feature access, request limits, and upgrade prompts genuinely change per tier.
- **Unlimited attachments without breaking usability**: gave every feature its own Plus control so files stay attached to the relevant prompt rather than a single global uploader.
- **Avoiding fabricated dashboard data**: built explicit empty states so new accounts start at zero.
- **Guest access without weakening security**: kept guest mode fully functional and unlimited, but structurally separate from the authenticated login flow.
- **Provider independence**: centralised all AI calls in one service layer so switching providers later is a backend change, not a rebuild.

## Experience With Lovable

Lovable converted a detailed, structured prompt into a working application in a single pass, and was strongest at scaffolding the dashboard, navigation, and component structure quickly. The clearer and more specific the prompt, the more accurately the output matched the intended design. The main challenge was keeping architectural rules, such as routing every feature through one shared AI service, consistent across every generated page, which took iterating on the prompt rather than editing the output directly.

## Responsible AI

Every AI generated page displays a disclaimer: AI generated legal content must be reviewed and verified before use in legal, academic, or professional settings. This project is an educational and productivity tool, not a substitute for professional legal advice.

## Setup

1. Open the project in Lovable using the link in the submission folder.
2. Or clone this repository and run `npm install` then `npm run dev`.
3. No API key is required to explore the app in guest mode.

## Author

Built by Yondela Gedeni for the CAPACITI AI Skills Acceleration Programme.

Core features

Legal Email Generator: recipient, matter, purpose, and tone in, editable correspondence out.
Meeting Summarizer: notes or files in, executive summary, action items, and deadlines out.
AI Task Planner: tasks and deadlines become a prioritised schedule.
Legal Research Assistant: research question and jurisdiction in, summary and authorities out.
AI Legal Chat: persistent, legal focused conversation with history and a Plus attachment control beside the prompt box.
Premium features: Contract Review, Legal Document Explainer, Case Timeline Generator, Court Preparation Assistant, Citation Formatter, Argument Builder, Legal Writing Coach.

Subscription tiers (ZAR)

Basic (R0): 10 AI requests a day, Email Generator, Meeting Summarizer, limited Chat.
Pro (R299): everything in Basic, unlimited requests, Task Planner, Research Assistant, history and analytics.
Premium (from R699): everything in Pro, advanced drafting, contract review, citation generation, priority AI.
Guest mode is fully functional and unlimited, with no account required.

Attachments and Input

Every AI feature accepts attachments through a Plus control next to the prompt box: PDF, DOCX, TXT, and images, plus pasted URLs and links from Google Drive, OneDrive, and Dropbox. Uploaded files are read and understood by the AI service, not just stored. Attachment count and prompt length are both uncapped. For long form output, users can set a target word count so the AI generates essays or documents at the length they choose.

Architecture

Frontend: React, component based, shared layouts, cards, forms, and modals, fully responsive.
AI service layer: one reusable service function handles every feature. Prompts are stored separately from the UI, so the provider (currently OpenAI) can be swapped without rewriting the app.
Authentication: email login, registration, forgot password, Google and Microsoft sign in, protected routes, and full guest access.
Usage tracking: daily AI requests are tracked per tier and reset daily. Reaching a limit disables generation and shows an upgrade prompt.
Data: every new account starts at zero. History and analytics populate only from real activity.

Tools and Technologies Used

Lovable AI: built the working application from a structured specification.
ChatGPT: drafted and refined the prompt engineering behind the build.
OpenAI API: the configured AI provider for the backend service layer.
GitHub: version control and submission.
React: frontend architecture.

Sample Prompt

Build a production ready, responsive SaaS application called Chambers OS, an AI powered platform for legal professionals. Every button, form, and page must work. Every AI feature must call one shared, reusable AI service, with prompts stored separately from the UI. Support unlimited attachments and unlimited prompt length, with the AI able to read and respond to uploaded documents. Include a subscription system in South African Rand that genuinely enables and disables features, a fully functional and unlimited guest mode, and a responsible AI disclaimer on every AI page.
The full build prompt is in lovable-prompt.md.

Challenges and Solutions

Keeping every AI feature consistent: routed all tools through one shared AI service with prompts kept in a separate library.
Subscription tiers that do more than change colour: feature access, request limits, and upgrade prompts genuinely change per tier.
Unlimited attachments without breaking usability: gave every feature its own Plus control so files stay attached to the relevant prompt rather than a single global uploader.
Avoiding fabricated dashboard data: built explicit empty states so new accounts start at zero.
Guest access without weakening security: kept guest mode fully functional and unlimited, but structurally separate from the authenticated login flow.
Provider independence: centralised all AI calls in one service layer so switching providers later is a backend change, not a rebuild.

Experience With Lovable

Lovable converted a detailed, structured prompt into a working application in a single pass, and was strongest at scaffolding the dashboard, navigation, and component structure quickly. The clearer and more specific the prompt, the more accurately the output matched the intended design. The main challenge was keeping architectural rules, such as routing every feature through one shared AI service, consistent across every generated page, which took iterating on the prompt rather than editing the output directly.

Responsible AI

Every AI generated page displays a disclaimer: AI generated legal content must be reviewed and verified before use in legal, academic, or professional settings. This project is an educational and productivity tool, not a substitute for professional legal advice.

Setup

Open the project in Lovable using the link in the submission folder.
Or clone this repository and run npm install then npm run dev.
No API key is required to explore the app in guest mode.

Author

Yondela Gedeni.
