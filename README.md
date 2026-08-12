# AI Study Assistant

An AI-powered study assistant that transforms study notes into structured and useful study material. Users can enter their notes and receive an AI-generated summary, key concepts, and practice questions.

## Project Brief

The AI Study Assistant is designed for students who want to quickly turn unstructured study notes into organized revision material. The application accepts study notes as input and uses an LLM to generate a short summary, important concepts, and practice questions. I chose this idea because students often have large amounts of notes but may not have enough time to organize them into revision material manually.

## Features

- Enter study notes through a simple interface
- Generate an AI-powered study guide
- Short summary of the notes
- Key concepts and important points
- Five practice questions
- Student-friendly explanations
- Loading state while AI content is generated
- Error handling when the AI request fails
- Responsive frontend interface
- API key kept on the backend instead of exposing it in the frontend

## Tech Stack

### Frontend
- React
- Vite
- CSS

### Backend
- Node.js
- Express.js
- CORS
- dotenv

### AI Integration
- OpenRouter API
- Large Language Model for generating study material

## How It Works

The application consists of two main parts:

```text
User
  ↓
React Frontend
  ↓
Express Backend
  ↓
OpenRouter API
  ↓
AI-generated study material
  ↓
React Frontend
  ↓
User



ai-study-assistant/
├── public/
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── server.cjs
├── vite.config.js
└── README.md


Enter notes
     ↓
Click Generate
     ↓
Loading state
     ↓
Backend receives notes
     ↓
OpenRouter generates response
     ↓
Study guide displayed

LIVE APPLICATION URL:
[]



