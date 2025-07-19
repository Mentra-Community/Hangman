import * as dotenv from 'dotenv';
dotenv.config();

import {
  AppServer,
  AppSession,
  StreamType,
  createTranscriptionStream,
} from '@mentra/sdk';
import { getRandomWord } from './words';
import { create1BitBMP, createCanvas, drawLine, drawCircle } from './bitmap';
import { drawText, getTextWidth } from './font';
import * as path from 'path';

// Configuration constants
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 80;
const PACKAGE_NAME = process.env.PACKAGE_NAME;
const AUGMENTOS_API_KEY = process.env.AUGMENTOS_API_KEY;

// Validate required environment variables
if (!PACKAGE_NAME) {
  throw new Error('PACKAGE_NAME environment variable is required');
}
if (!AUGMENTOS_API_KEY) {
  throw new Error('AUGMENTOS_API_KEY environment variable is required');
}

enum GameState {
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST',
  WAITING_RESTART = 'WAITING_RESTART'
}

interface HangmanGame {
  word: string;
  guessedLetters: Set<string>;
  wrongGuesses: number;
  state: GameState;
  maxWrongGuesses: number;
}

class HangmanManager {
  private games: Map<string, HangmanGame> = new Map();

  createGame(userId: string): HangmanGame {
    const game: HangmanGame = {
      word: getRandomWord(),
      guessedLetters: new Set(),
      wrongGuesses: 0,
      state: GameState.PLAYING,
      maxWrongGuesses: 6
    };
    this.games.set(userId, game);
    return game;
  }

  getGame(userId: string): HangmanGame | undefined {
    return this.games.get(userId);
  }

  processInput(userId: string, input: string): void {
    let game = this.getGame(userId);
    
    if (!game) {
      game = this.createGame(userId);
    }

    const normalizedInput = input.trim().toUpperCase();

    if (game.state === GameState.WAITING_RESTART) {
      if (normalizedInput.includes('PLAY AGAIN')) {
        this.createGame(userId);
        return;
      }
    }

    if (game.state !== GameState.PLAYING) {
      return;
    }

    // Strip punctuation from the end and check for pattern " {letter}"
    const cleanedInput = normalizedInput.replace(/[.,!?]+$/, '');
    const letterMatch = cleanedInput.match(/\s([A-Z])$/);
    
    let guessedLetter: string | null = null;
    
    if (letterMatch) {
      guessedLetter = letterMatch[1];
    } else if (cleanedInput.length === 1 && /[A-Z]/.test(cleanedInput)) {
      // Also handle single letter input
      guessedLetter = cleanedInput;
    }

    if (guessedLetter && !game.guessedLetters.has(guessedLetter)) {
      game.guessedLetters.add(guessedLetter);
      
      if (!game.word.includes(guessedLetter)) {
        game.wrongGuesses++;
      }

      if (this.isWordComplete(game)) {
        game.state = GameState.WON;
        game.state = GameState.WAITING_RESTART;
      } else if (game.wrongGuesses >= game.maxWrongGuesses) {
        game.state = GameState.LOST;
        game.state = GameState.WAITING_RESTART;
      }
    }
  }

  private isWordComplete(game: HangmanGame): boolean {
    return game.word.split('').every(letter => game.guessedLetters.has(letter));
  }

  renderGameStateAsBase64(userId: string): string {
    const game = this.getGame(userId) || this.createGame(userId);
    const canvas = createCanvas(524, 100);

    this.drawWord(canvas, game);
    this.drawHangman(canvas, game);
    this.drawGuessedLetters(canvas, game);

    if (game.state === GameState.WAITING_RESTART) {
      this.drawEndMessage(canvas, game);
    }

    const bitmapBuffer = create1BitBMP(526, 100, canvas);
    return bitmapBuffer.toString('base64');
  }

  private drawWord(canvas: boolean[][], game: HangmanGame): void {
    let displayWord = '';
    for (const letter of game.word) {
      if (game.guessedLetters.has(letter)) {
        displayWord += letter + ' ';
      } else {
        displayWord += '_ ';
      }
    }
    
    drawText(canvas, displayWord.trim(), 20, 10, 2);
  }

  private drawGuessedLetters(canvas: boolean[][], game: HangmanGame): void {
    const labelText = 'GUESSED';
    const labelWidth = getTextWidth(labelText, 2);
    drawText(canvas, labelText, 526 - labelWidth - 20, 10, 2);
    
    const sortedLetters = Array.from(game.guessedLetters).sort();
    const lettersText = sortedLetters.join(' ');
    const lettersWidth = getTextWidth(lettersText, 2);
    drawText(canvas, lettersText, 526 - lettersWidth - 20, 30, 2);
  }

  private drawHangman(canvas: boolean[][], game: HangmanGame): void {
    const x = 70;
    const y = 35;
    
    drawLine(canvas, x - 20, y + 50, x + 20, y + 50, true);
    drawLine(canvas, x, y + 50, x, y - 10, true);
    drawLine(canvas, x, y - 10, x + 30, y - 10, true);
    drawLine(canvas, x + 30, y - 10, x + 30, y, true);
    
    if (game.wrongGuesses >= 1) {
      drawCircle(canvas, x + 30, y + 5, 5, true);
    }
    
    if (game.wrongGuesses >= 2) {
      drawLine(canvas, x + 30, y + 10, x + 30, y + 25, true);
    }
    
    if (game.wrongGuesses >= 3) {
      drawLine(canvas, x + 30, y + 15, x + 25, y + 20, true);
    }
    
    if (game.wrongGuesses >= 4) {
      drawLine(canvas, x + 30, y + 15, x + 35, y + 20, true);
    }
    
    if (game.wrongGuesses >= 5) {
      drawLine(canvas, x + 30, y + 25, x + 25, y + 35, true);
    }
    
    if (game.wrongGuesses >= 6) {
      drawLine(canvas, x + 30, y + 25, x + 35, y + 35, true);
    }
  }

  private drawEndMessage(canvas: boolean[][], game: HangmanGame): void {
    let message = '';
    if (game.state === GameState.WAITING_RESTART) {
      if (this.isWordComplete(game)) {
        message = 'YOU WIN! SAY "PLAY AGAIN"';
      } else {
        message = `YOU LOSE! WORD: ${game.word}. SAY "PLAY AGAIN"`;
      }
    }
    
    const scale = 1;
    const textWidth = getTextWidth(message, scale);
    const x = Math.floor((526 - textWidth) / 2);
    drawText(canvas, message, x, 85, scale);
  }

  deleteGame(userId: string): void {
    this.games.delete(userId);
  }
}

// Global game manager instance
const hangmanManager = new HangmanManager();

/**
 * HangmanApp - Main application class that extends AppServer
 */
class HangmanApp extends AppServer {
  constructor() {
    super({
      packageName: PACKAGE_NAME!,
      apiKey: AUGMENTOS_API_KEY!,
      port: PORT,
      publicDir: path.resolve(__dirname, './public'),
    });
  }

  /**
   * Called by AppServer when a new session is created
   */
  protected async onSession(session: AppSession, sessionId: string, userId: string): Promise<void> {
    console.log(`🎮 Received Hangman session request for user ${userId}, session ${sessionId}`);

    try {
      // Sanitize userId (remove periods from email)
      const sanitizedUserId = userId.replace(/\./g, '_');

      // Create or get game for this user
      hangmanManager.getGame(sanitizedUserId) || hangmanManager.createGame(sanitizedUserId);

      // Subscribe to transcription events
      const transcriptionStream = createTranscriptionStream("en-US") as unknown as StreamType;
      session.subscribe(transcriptionStream);

      // Register transcription handler
      const cleanup = session.events.onTranscription((data: any) => {
        this.handleTranscription(session, sessionId, sanitizedUserId, data);
      });

      // Add cleanup handler
      this.addCleanupHandler(cleanup);

      // Show initial game state
      this.updateDisplay(session, sanitizedUserId);
      
      console.log(`Hangman session initialized for user ${sanitizedUserId}`);
      
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  }

  /**
   * Called by AppServer when a session is stopped
   */
  protected async onStop(sessionId: string, userId: string, reason: string): Promise<void> {
    console.log(`💥 Session termination - User: ${userId}, Session: ${sessionId}, Reason: ${reason}`);
    
    try {
      const sanitizedUserId = userId.replace(/\./g, '_');
      hangmanManager.deleteGame(sanitizedUserId);
      console.log(`✅ Game cleaned up for user ${sanitizedUserId}`);
    } catch (error) {
      console.error(`❌ Error during session cleanup:`, error);
    }
  }

  /**
   * Handles transcription data from the user
   */
  private handleTranscription(
    session: AppSession, 
    sessionId: string, 
    userId: string, 
    transcriptionData: any
  ): void {
    const isFinal = transcriptionData.isFinal;
    const text = transcriptionData.text.toLowerCase().trim();

    console.log(`[Session ${sessionId}]: Received transcription - ${text} (isFinal: ${isFinal})`);
    
    // Only process final transcriptions
    if (!isFinal) return;
    
    // Process the input
    hangmanManager.processInput(userId, text);
    
    // Update the display
    this.updateDisplay(session, userId);
  }

  /**
   * Updates the bitmap display for the user
   */
  private updateDisplay(session: AppSession, userId: string): void {
    try {
      const base64Bitmap = hangmanManager.renderGameStateAsBase64(userId);
      session.layouts.showBitmapView(base64Bitmap);
    } catch (error) {
      console.error('Error updating display:', error);
    }
  }
}

// Create and start the app
const hangmanApp = new HangmanApp();

// Add a route to verify the server is running
const expressApp = hangmanApp.getExpressApp();
expressApp.get('/health', (_req: any, res: any) => {
  res.json({ status: 'healthy', app: PACKAGE_NAME });
});

// Start the server
hangmanApp.start().then(() => {
  console.log(`${PACKAGE_NAME} server running on port ${PORT}`);
}).catch(error => {
  console.error('Failed to start server:', error);
});