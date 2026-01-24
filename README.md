# Intonation - Pitch Trainer

A basic React web app for training your ear to differentiate pitch.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to the URL shown (usually `http://localhost:8080`).

## Game Logic
- The game generates a frequency and then a second frequency based on the current level.
- The higher the level, the smaller the frequency difference.
- You have 3 lives. If you guess incorrectly, you lose a life.
- The "second" pitch of a level becomes the "first" pitch of the next level.
