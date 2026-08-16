# AI Workflow Comparison

## Overview

For this exercise, I implemented the same study preferences feature twice in my AI Study Assistant. The feature allows users to select a difficulty level, choose the number of practice questions, and control which sections appear in the AI-generated output.

Round One used a single vague prompt: "Add a study preferences form with validation to this app." Round Two used a detailed specification with file references, constraints, expected behavior, accessibility requirements, edge cases, testing, and a verification step.

## Round One: Vague Prompt

The vague prompt produced a working implementation quickly. It added the preferences form, validation, backend integration, and tests. Round One finished with 10 passing tests.

However, because the prompt did not define detailed behavior, the AI made many implementation decisions itself. This increased review effort because I had to inspect its assumptions about validation, accessibility, user interaction, and edge cases.

## Round Two: Spec-Driven Workflow

For Round Two, I started a fresh AI session and used an explore-plan-code-verify workflow. The AI first inspected the existing project, planned the implementation, then implemented and tested it.

Round Two produced more detailed interaction and accessibility handling. The final suite contained 15 passing tests across three test files. Tests covered validation, keyboard/user interactions, preference changes, and output-option behavior. Validation errors also use accessible behavior such as `role="alert"` and `aria-invalid`.

An important edge case was handled: the user cannot deselect the final remaining output option, preventing generation with no requested output.

The backend also validates difficulty, question count, and output selections before constructing an AI prompt based on those preferences.

## AI Mistakes and Verification

Round Two was not automatically correct. During its initial verification, two tests failed because of ambiguous label matching and a controlled-input issue. These were fixed through the test-and-review loop.

Manual end-to-end testing then revealed another issue that the passing tests had not exposed: the frontend was still calling the deployed production backend instead of the modified local backend. As a result, selecting 10 practice questions still generated the old default of five. I changed the local integration to use the updated backend and updated the affected test. The final suite passed all 15 tests, and manual testing confirmed that the selected preferences affected the AI output.

The biggest lesson was that a precise prompt does not eliminate review. It makes expected behavior clearer and verification more systematic. Round Two required more planning upfront but reduced uncertainty and provided stronger evidence that the implementation actually worked.