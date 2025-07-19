# Hangman for Smart Glasses

A classic Hangman word-guessing game designed for smart glasses with a 526x100 pixel 1-bit bitmap display. Built using the Mentra SDK with voice-activated gameplay and real-time visual feedback.

## Overview

This application provides an immersive Hangman experience where players guess letters by speaking them aloud. The game features a curated collection of challenging words, progressive hangman drawing, and supports multiple simultaneous users.

## Features

- **Voice-Activated Gameplay**: Guess letters by speaking them (e.g., "A", "the letter B")
- **Visual Feedback**: Real-time hangman drawing with 6-stage progression
- **Smart Word Selection**: 136 carefully chosen words with varying difficulty
- **Multi-User Support**: Each user maintains their own game session
- **Session Persistence**: Games persist throughout user sessions
- **Restart Functionality**: Say "play again" to start a new game

## Game Mechanics

### Word Guessing
- Players guess letters one at a time using voice commands
- Correct guesses reveal all instances of that letter in the word
- Incorrect guesses add a body part to the hangman drawing
- Game ends when either the word is completed or the hangman is fully drawn (6 wrong guesses)

### Input Recognition
The game accepts various voice input formats:
- Single letters: "A", "B", "Z"
- Formal phrases: "The letter A", "Letter B"
- Case-insensitive recognition

### Visual Display
The 526x100 pixel display shows:
- **Word Progress**: Letters and blanks (e.g., "H A _ _ M A _")
- **Hangman Drawing**: Progressive 6-stage gallows and figure
- **Guessed Letters**: Alphabetically sorted list of previous guesses
- **End Game Messages**: Win/lose notifications with restart instructions

## Technical Architecture

### Core Components

- **`src/index.ts`**: Main application server using Mentra SDK
- **`src/words.ts`**: Curated word collection and random selection
- **`src/bitmap.ts`**: 1-bit BMP generation and canvas utilities
- **`src/font.ts`**: 5x7 pixel font rendering system

### Game State Management

```typescript
interface HangmanGame {
  word: string;
  guessedLetters: Set<string>;
  wrongGuesses: number;
  state: GameState;
  maxWrongGuesses: number;
}
```

States: `PLAYING`, `WON`, `LOST`, `WAITING_RESTART`

### Display Rendering

The game renders a complete visual state for each user interaction:
1. **Canvas Creation**: 526x100 boolean array
2. **Word Rendering**: Shows progress with guessed letters revealed
3. **Hangman Drawing**: Progressive illustration based on wrong guess count
4. **UI Elements**: Guessed letters list and game status
5. **BMP Conversion**: 1-bit bitmap generation for smart glasses display

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Bun runtime
- Mentra SDK API key

### Environment Configuration
Create a `.env` file with:
```env
PACKAGE_NAME=your-package-name
AUGMENTOS_API_KEY=your-api-key
PORT=80
```

### Installation
```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Start production server
bun run start
```

## Usage

1. **Start Game**: Launch the application and begin speaking
2. **Make Guesses**: Say individual letters to guess
3. **Track Progress**: Watch the hangman drawing and word completion
4. **Restart**: Say "play again" when the game ends
5. **Health Check**: Visit `/health` endpoint to verify server status

## Word Collection

The game includes 136 challenging words featuring:
- Varied lengths (4-12 letters)
- Diverse vocabulary (common and uncommon words)
- Strategic letter combinations
- Words with unique spelling patterns

Examples: ABRUPT, GALVANIZE, MYSTIFY, QUIXOTIC, RAZZMATAZZ, ZIGZAGGING

## Development

### Project Structure
```
src/
├── index.ts          # Main application server
├── words.ts          # Word collection and selection
├── bitmap.ts         # Canvas and BMP utilities
├── font.ts           # Pixel font rendering
├── public/
│   └── tpa_config.json
└── utils/            # Shared utilities
```

### Bitmap Format
- **Dimensions**: 526x100 pixels
- **Color Depth**: 1-bit (black and white)
- **Format**: Windows BMP with proper headers
- **Encoding**: Row-padded to 32-bit boundaries

### Font System
- **Character Set**: A-Z, 0-9, punctuation
- **Dimensions**: 5x7 pixels per character
- **Scaling**: Configurable scale factor for larger text
- **Spacing**: 1 pixel between characters by default

## Deployment

The application is containerized with Docker and can be deployed using the included configuration:

```bash
# Build and deploy
docker build -t hangman-game .
```

Includes Porter configuration for cloud deployment with automatic scaling and health monitoring.

## API Endpoints

- **`/health`**: Server health check
- **Mentra SDK**: Handles session management and transcription streams

## Contributing

1. Follow the existing code style and patterns
2. Test voice recognition thoroughly
3. Ensure bitmap rendering accuracy
4. Maintain session isolation between users
5. Update word collection thoughtfully

## License

ISC License - See LICENSE file for details.