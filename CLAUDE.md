# Project Rules

These rules were developed from the two-round AI workflow comparison for the AI Study Assistant.

## 1. Verify frontend and backend integration

When modifying API behavior, verify that the frontend is calling the backend version being tested. Do not rely only on unit tests. Perform an end-to-end manual test of the affected feature before considering it complete.

## 2. Study preferences must be validated on both sides

Validate study preferences before sending a generation request and validate them again on the server. Difficulty must be easy, medium, or hard. Practice question count must be a whole number from 1 to 20, and at least one output option must remain selected.

## 3. Form validation must be accessible

Validation errors must be visible to the user and programmatically accessible. Invalid controls should use `aria-invalid`, and validation messages should use an appropriate alert mechanism such as `role="alert"`.

## 4. AI-generated features require verification

After AI-generated code is implemented, run the complete test suite and manually test the critical user flow. Do not accept an implementation only because the code compiles or the AI reports that it works.

## 5. Tests must cover user behavior

Tests for interactive components should verify actual user behavior such as changing difficulty, entering a question count, selecting output options, and handling invalid input rather than checking only whether elements render.