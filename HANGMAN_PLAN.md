# Hangman Game Planning

## Overview
Create a hangman game for smart glasses with 526x100px 1-bit display

## Architecture

### Components
1. **hangman.ts** - Core game logic and bitmap generation
2. **words.ts** - Word list (100 words)
3. **index.html** - Simple webpage with input and bitmap display
4. **bitmap.ts** - Bitmap generation utilities (1-bit BMP format)
5. **font.ts** - Simple pixel font for text rendering

### Game States
- PLAYING - Active game, accepting letter guesses
- WON - Player guessed the word
- LOST - Player ran out of guesses
- WAITING_RESTART - Showing win/lose screen, waiting for "play again"

### Display Layout (526x100)
```
+--------------------------------------------------+
|  H A _ _ M A _        GUESSED: A B C D E F      |
|                                                  |
|      O                WRONG: 3/6                 |
|     /|\                                          |
|     / \                                          |
|                                                  |
+--------------------------------------------------+
```

### Input Processing
- Single letter input → process guess
- "play again" → restart game
- Any other input → ignore or show error

### Bitmap Generation Flow
1. Draw background (white)
2. Render word with blanks
3. Render guessed letters
4. Draw hangman based on wrong count
5. Render status (wrong count)
6. Convert to 1-bit BMP

### Font Strategy
- Use simple 5x7 pixel font
- Monospace for alignment
- Scale up if needed for readability

## Implementation Steps
1. Create bitmap utilities for 1-bit BMP
2. Implement simple pixel font
3. Create word list
4. Build core game logic
5. Create bitmap renderer for game state
6. Build simple web interface
7. Test and iterate on layout

## Questions Resolved
- Input: Web form with text input
- Words: Hardcoded list of 100 words
- Flow: Win/lose → "play again" to restart
- Output: 1-bit BMP files displayed in browser
- Hangman: Classic 6 wrong guesses progression
- Case: Case-insensitive input
- Architecture: Multi-user support via userId:gameState map
- Files: Save as hangman_user.bmp (will scale to hangman_userId.bmp)
- Frontend: HTML only for display simulation, all logic in backend TS