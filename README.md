# AI Study Assistant

An AI-powered study tool that transforms students' study notes into a concise summary, key concepts, and practice questions. The project was built as a capstone application to demonstrate frontend development, meaningful AI integration, testing, accessibility, error handling, and production deployment.

## Live Demo

**Frontend:** https://ai-study-assistant-ten-kohl.vercel.app/

**GitHub Repository:** https://github.com/jigyasax15/AI-study-assistant

## Features

* Paste study notes into the application.
* Generate AI-powered study material.
* Get a short summary of the notes.
* Extract important concepts.
* Generate five practice questions based on the provided notes.
* Markdown-formatted AI responses.
* Input validation for empty notes.
* Loading state while AI material is being generated.
* User-friendly error messages when requests fail.
* Accessible form controls and dynamic result announcements.
* Automated component tests using Vitest and React Testing Library.

## Tech Stack

### Frontend

* React
* Vite
* React Markdown
* CSS

### Backend

* Node.js
* Express
* CORS
* dotenv
* OpenAI SDK
* OpenRouter API

### Testing

* Vitest
* React Testing Library
* Testing Library Jest DOM

### Deployment

* Vercel — frontend
* Render — backend

## Project Architecture

```text
AI-study-assistant/
│
├── public/
│
├── src/
│   ├── tests/
│   │   └── App.test.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── test-setup.js
│
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

The React frontend provides the user interface for entering study notes and displaying the generated study material.

`App.jsx` manages:

* User input
* Loading state
* Error state
* API requests
* Displaying AI-generated Markdown content

### Backend

`server.cjs` provides the API endpoint used by the frontend.

The backend:

1. Receives the user's study notes.
2. Validates the request.
3. Sends the notes to the AI model through OpenRouter.
4. Uses a structured prompt to request a summary, key concepts, and practice questions.
5. Returns the generated result to the frontend.

Keeping the AI request on the backend prevents the API key from being exposed in the client-side application.

## AI Integration

The application uses an LLM through the OpenRouter API.

The backend sends the user's notes along with instructions asking the model to produce:

1. A short summary.
2. Important concepts in bullet points.
3. Five practice questions based only on the provided notes.

The AI is therefore used as a study-material generator rather than as a general-purpose chatbot. This makes the AI feature directly connected to the application's purpose.

The API key is stored as the `OPENROUTER_API_KEY` environment variable and is not committed to the repository.

## Running Locally

### Prerequisites

* Node.js installed
* An OpenRouter API key

### Install dependencies

```bash
npm install
```

### Configure the API key

Create a `.env.local` file in the project root:

```env
OPENROUTER_API_KEY=your_api_key_here
```

Do not commit this file to GitHub.

### Start the frontend

```bash
npm run dev
```

The Vite development server will provide the local frontend URL.

### Start the backend

In a separate terminal:

```bash
node server.cjs
```

The backend runs on port `3001` by default.

## Testing

The project uses Vitest and React Testing Library for component testing.

Run the tests with:

```bash
npm run test:run
```

The current test suite verifies important user interactions including:

* Showing an error when the user attempts to generate material without entering notes.
* Showing the loading state when notes are submitted.

The latest test run passed successfully:

```text
Test Files  1 passed (1)
Tests       2 passed (2)
```

## Accessibility & Performance

The deployed application was tested using Google Lighthouse.

| Category       | Score |
| -------------- | ----: |
| Performance    |    99 |
| Accessibility  |   100 |
| Best Practices |   100 |
| SEO            |    90 |

The application includes accessibility-focused features such as:

* Proper labels for form controls.
* Semantic HTML elements.
* `role="alert"` for error messages.
* `aria-live="polite"` for generated results.
* Disabled state for the generation button while processing.

The Lighthouse accessibility score of 100 indicates that the deployed application passed the evaluated accessibility checks without detected WCAG-related issues.

## Error Handling

The application handles several failure cases safely.

### Empty input

If the user attempts to generate material without entering notes, the application displays an error instead of sending an unnecessary API request.

### AI/API failure

If the backend or AI request fails, the application catches the error and displays a user-friendly message instead of exposing technical implementation details.

### Loading state

While the AI request is processing, the button is disabled and displays a loading message to prevent repeated submissions.

## Deployment

The frontend is deployed on Vercel and the backend is deployed on Render.

The production deployment uses an environment variable for the OpenRouter API key.

Before deployment, the application was tested locally and the production version was verified after deployment.

## Known Limitations

* The application currently generates study material from text notes only.
* There is no user authentication or saved study history.
* Generated material is not permanently stored.
* AI-generated content can contain inaccuracies and should be reviewed by the student.
* The application currently uses a single AI generation workflow.

## Future Improvements

Possible future improvements include:

* Adding user accounts and saved study sessions.
* Supporting uploaded PDF or document notes.
* Adding flashcard generation.
* Adding multiple difficulty levels for practice questions.
* Allowing users to regenerate individual sections.
* Adding more comprehensive automated tests.
* Adding usage limits and monitoring for production traffic.
* Improving SEO and adding richer metadata.

## Production & Rollback

Production deployments are connected to the GitHub repository.

If a future deployment introduces a problem, the previous stable Git commit can be redeployed from the `main` branch through the deployment platform.

Deployment logs from Vercel and Render can be used to investigate build and runtime issues.

## Project Status

**Production-ready capstone application**

* Live deployment: Complete
* AI integration: Complete
* Error handling: Complete
* Automated testing: Complete
* Accessibility audit: Complete
* Performance audit: Complete
* Deployment documentation: Complete
