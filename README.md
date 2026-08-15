# AI Study Assistant

## Project Brief

The AI Study Assistant is a web application designed to help students turn their study notes into useful revision material. Instead of manually creating summaries and practice questions, students can paste their notes into the application and use an AI model to generate a concise summary, key concepts, and five practice questions based on those notes. I chose this idea because studying often involves spending significant time organizing information before actually revising it, and I wanted to build a small application where AI provides a practical benefit rather than functioning as a generic chatbot.

## Live Demo

**Frontend:** https://ai-study-assistant-ten-kohl.vercel.app/

**Backend:** https://ai-study-assistant-ge1o.onrender.com

**GitHub Repository:** https://github.com/jigyasax15/AI-study-assistant

> The backend root URL may display `Cannot GET /` because the application exposes its AI functionality through the `POST /api/generate` endpoint rather than a public homepage.

## Features

- Paste study notes into the application.
- Generate AI-powered study material.
- Get a concise summary of the notes.
- Extract important concepts.
- Generate five practice questions based only on the provided notes.
- Display AI responses using Markdown formatting.
- Validate empty input before making an API request.
- Show a loading state while study material is generated.
- Announce the loading state to assistive technologies.
- Display user-friendly error messages when requests fail.
- Use accessible form controls and dynamic result announcements.
- Run automated component tests using Vitest and React Testing Library.

## Tech Stack

### Frontend

- React
- Vite
- React Markdown
- CSS

### Backend

- Node.js
- Express
- CORS
- dotenv
- OpenAI SDK configured for the OpenRouter-compatible API
- OpenRouter API

### Testing

- Vitest
- React Testing Library
- Testing Library Jest DOM
- Vitest V8 Coverage

### Deployment

- Vercel — frontend
- Render — backend

## Project Architecture

```text
AI-study-assistant/
│
├── public/
├── src/
│   ├── tests/
│   │   └── App.test.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── test-setup.js
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── server.cjs
├── vite.config.js
└── vitest.config.js
```

### Frontend

The React frontend provides the interface for entering study notes and displaying generated study material.

`src/App.jsx` manages:

- User input
- Loading state
- Error state
- Requests to the backend
- Rendering AI-generated Markdown content
- Accessible status announcements

`src/main.jsx` is the application entry point.

`src/App.css` and `src/index.css` contain the application's styling and layout.

### Backend

`server.cjs` runs the Express backend and provides the `POST /api/generate` endpoint.

The backend:

1. Receives the user's study notes.
2. Validates that the notes are not empty.
3. Sends the notes and structured instructions to an LLM through OpenRouter.
4. Requests a summary, key concepts, and five practice questions.
5. Returns the generated result to the frontend.
6. Returns a user-safe error response if AI generation fails.

Keeping the AI request on the backend prevents the OpenRouter API key from being exposed in client-side code.

### Application Flow

```text
User
  ↓
React + Vite Frontend
  ↓
POST /api/generate
  ↓
Express Backend
  ↓
OpenRouter LLM
  ↓
Generated Study Material
  ↓
React Markdown
  ↓
User
```

### Testing

`src/tests/App.test.jsx` contains component tests for important user interactions.

`src/test-setup.js` configures Testing Library Jest DOM matchers.

`vitest.config.js` configures Vitest and the jsdom test environment.

### Configuration

- `package.json` contains project dependencies and scripts.
- `vite.config.js` configures the Vite frontend.
- `.gitignore` excludes sensitive and generated files such as `.env.local` and `coverage/`.
- `.env.local` stores the local OpenRouter API key and is intentionally not committed.

## AI Integration

The application uses an LLM through the OpenRouter API. AI is used specifically to transform unstructured study notes into structured revision material rather than to provide a general-purpose chatbot.

### System Instruction

```text
You are a helpful study assistant. Create clear, student-friendly study material from the notes provided.
```

### User Prompt Structure

```text
Analyze these study notes and provide:

# Study Guide

## 1. Short Summary
Give a concise summary.

## 2. Key Concepts
List the most important concepts using bullet points.

## 3. Practice Questions
Create five questions based only on the notes.

Use clear Markdown headings, bullet points, numbered lists, and paragraphs.

Study notes:
[User-provided notes]
```

### Why AI Is Used

Organizing notes into summaries, key concepts, and practice questions is repetitive and time-consuming. The LLM performs this transformation automatically while keeping the generated content tied to the notes supplied by the student. This makes the AI capability directly relevant to the application's purpose.

The API key is stored in the `OPENROUTER_API_KEY` environment variable and is not committed to the repository.

## Running Locally

### Prerequisites

- Node.js
- An OpenRouter API key

### 1. Clone the repository

```bash
git clone https://github.com/jigyasax15/AI-study-assistant.git
cd AI-study-assistant
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API key

Create a `.env.local` file in the project root:

```env
OPENROUTER_API_KEY=your_api_key_here
```

Do not commit this file to GitHub.

### 4. Start the frontend

In the first terminal:

```bash
npm run dev
```

Vite will display the local frontend URL.

### 5. Start the backend

In a second terminal in the same project folder:

```bash
node server.cjs
```

The backend runs on port `3001` by default.

### 6. Use the application

Open the Vite URL shown in the terminal, paste study notes into the form, and select **Generate study material**.

The frontend sends the notes to the Express backend, which communicates with OpenRouter and returns the generated study material.

## Testing

The project uses Vitest and React Testing Library for component testing.

Run the tests with:

```bash
npm run test:run
```

Generate the coverage report with:

```bash
npm run test:run -- --coverage
```

The current test suite verifies:

- An error is shown when the user tries to generate material without entering notes.
- The loading state is shown when notes are submitted.

### Latest Test Results

```text
Test Files  1 passed (1)
Tests       2 passed (2)
```

### Coverage Results

| Metric | Coverage |
| --- | ---: |
| Statements | 66.66% |
| Branches | 58.33% |
| Functions | 100% |
| Lines | 66.66% |

The measured component coverage exceeds the capstone requirement of at least 50%.

## Performance & Accessibility Audit

### Lighthouse

The deployed frontend was audited with Google Lighthouse.

| Category | Score |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 90 |

### WAVE

The deployed application was also evaluated using the WAVE Web Accessibility Evaluation Tool.

| WAVE Result | Count / Score |
| --- | ---: |
| Errors | 0 |
| Contrast Errors | 0 |
| Alerts | 0 |
| AIM Score | 10/10 |

WAVE reported no detected errors. Automated audits do not verify every WCAG requirement, so manual accessibility review remains important.

### Accessibility Features

The application includes:

- A programmatically associated label for the study-notes textarea.
- Semantic HTML elements.
- `role="alert"` for error messages.
- `aria-live="polite"` for generated results.
- A disabled generation button while a request is processing.
- A visually hidden live status message that announces when study material is being generated.

### Concrete Accessibility Improvement

During the accessibility audit and review process, the asynchronous loading experience was identified as an area that could provide clearer feedback to screen-reader users. A visually hidden `role="status"` message with `aria-live="polite"` was added so assistive technologies announce that study material is being generated.

The existing automated component tests were rerun after the change and remained at **2/2 passing**. The deployed application was then rechecked with WAVE and continued to report **0 errors, 0 contrast errors, 0 alerts, and an AIM score of 10/10**.

## Error Handling & Resilience

### Empty Input

If the user tries to generate material without entering notes, the frontend displays an error and does not send an unnecessary API request.

### AI/API Failure

If the backend or AI request fails, the application catches the failure and displays a user-friendly message rather than exposing implementation details.

### Loading State

While generation is in progress, the button is disabled and displays a loading message to reduce repeated submissions. A live status message also provides feedback to assistive technologies.

These states allow the application to fail safely instead of leaving the user with an unexplained or broken interface.

## Deployment & Operation

The frontend is deployed on Vercel and the backend is deployed on Render. The production OpenRouter API key is stored as an environment variable rather than in source control.

Production deployments are connected to the GitHub repository, allowing code changes on the deployment branch to trigger new deployments.

### Deployment Checklist

| Check | Status |
| --- | :---: |
| Application builds successfully | ✅ |
| Frontend deployed to Vercel | ✅ |
| Backend deployed to Render | ✅ |
| Production frontend URL verified | ✅ |
| AI generation verified in production | ✅ |
| OpenRouter API key stored as an environment variable | ✅ |
| API key excluded from Git | ✅ |
| Empty-input error handling verified | ✅ |
| API failure state implemented | ✅ |
| Loading state verified | ✅ |
| Screen-reader loading announcement implemented | ✅ |
| Automated tests passing | ✅ |
| Component coverage requirement met | ✅ |
| Lighthouse performance audit completed | ✅ |
| Lighthouse accessibility audit completed | ✅ |
| WAVE accessibility audit completed | ✅ |
| Rollback plan documented | ✅ |
| Deployment/build logs available | ✅ |

**Deployment sign-off:** Complete for the capstone requirements documented in this repository.

### Monitoring

Vercel and Render deployment/build logs can be used to investigate deployment and runtime failures. The current project does not use a separate third-party application-monitoring service.

### Rollback Plan

If a new deployment introduces a problem, Git history can be used to identify the previous stable commit and redeploy that stable version through the deployment platform. This provides a straightforward rollback path for the current project.

## Known Limitations

- The application currently accepts text notes only.
- There is no user authentication.
- Study sessions and generated results are not permanently stored.
- AI-generated material can contain inaccuracies and should be reviewed by the student.
- The application uses one study-material generation workflow.
- There are no user-specific AI usage limits.
- Monitoring currently relies on deployment/platform logs rather than a dedicated monitoring service.

## Future Improvements

Possible improvements include:

- Adding user accounts and saved study sessions.
- Supporting PDF and document uploads.
- Adding flashcard generation.
- Adding difficulty levels for practice questions.
- Allowing individual sections to be regenerated.
- Expanding automated tests to cover successful API responses and failure states.
- Adding structured validation for AI output.
- Adding usage limits for production traffic.
- Adding dedicated application monitoring.
- Improving SEO and adding richer metadata.

## Reflection

The hardest part of this project was not building the basic AI feature, but getting all the different parts of the application to work together in a production environment. The application initially worked locally because the frontend could communicate directly with the local Express server. Deployment required separating the frontend and backend, configuring a production API URL, managing environment variables, and troubleshooting deployment configuration. This showed me that deploying an application involves much more than writing the feature itself.

If I built the project again, I would plan the deployment architecture earlier. I would separate the frontend and backend from the beginning and use environment-based API URLs throughout development. I would also introduce automated testing earlier instead of adding it near the final production stage. This would make development more organized and reduce the risk of finding testing or deployment issues close to submission.

One thing that surprised me was how many considerations are involved in making even a small application production-ready. The AI generation itself was relatively straightforward, but error states, loading states, API-key security, accessibility, testing, performance, deployment, and rollback planning required significant attention. The accessibility review also showed me that a visually simple loading state can still benefit from additional feedback for users of assistive technology.

Overall, this project taught me that shipping a project is different from simply completing a coding task. A production-ready application needs to be testable, accessible, secure, documented, deployable, and maintainable. The biggest lesson I learned was to think about the entire lifecycle of an application rather than focusing only on getting the main feature to work.

## Project Status

- Live deployment: Complete
- Meaningful AI integration: Complete
- Error handling and resilience: Complete
- Automated component testing: Complete
- Coverage requirement: Complete
- Lighthouse audit: Complete
- WAVE accessibility audit: Complete
- Concrete accessibility improvement: Complete
- Deployment documentation: Complete
- Monitoring approach: Documented
- Rollback plan: Documented
- README documentation: Complete
- Final structured portfolio entry: Pending