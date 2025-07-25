const FONT_5X7: { [key: string]: number[] } = {
  ' ': [0x00, 0x00, 0x00, 0x00, 0x00],
  'A': [0x7C, 0x12, 0x11, 0x12, 0x7C],
  'B': [0x7F, 0x49, 0x49, 0x49, 0x36],
  'C': [0x3E, 0x41, 0x41, 0x41, 0x22],
  'D': [0x7F, 0x41, 0x41, 0x22, 0x1C],
  'E': [0x7F, 0x49, 0x49, 0x49, 0x41],
  'F': [0x7F, 0x09, 0x09, 0x09, 0x01],
  'G': [0x3E, 0x41, 0x49, 0x49, 0x7A],
  'H': [0x7F, 0x08, 0x08, 0x08, 0x7F],
  'I': [0x00, 0x41, 0x7F, 0x41, 0x00],
  'J': [0x20, 0x40, 0x41, 0x3F, 0x01],
  'K': [0x7F, 0x08, 0x14, 0x22, 0x41],
  'L': [0x7F, 0x40, 0x40, 0x40, 0x40],
  'M': [0x7F, 0x02, 0x0C, 0x02, 0x7F],
  'N': [0x7F, 0x04, 0x08, 0x10, 0x7F],
  'O': [0x3E, 0x41, 0x41, 0x41, 0x3E],
  'P': [0x7F, 0x09, 0x09, 0x09, 0x06],
  'Q': [0x3E, 0x41, 0x51, 0x21, 0x5E],
  'R': [0x7F, 0x09, 0x19, 0x29, 0x46],
  'S': [0x46, 0x49, 0x49, 0x49, 0x31],
  'T': [0x01, 0x01, 0x7F, 0x01, 0x01],
  'U': [0x3F, 0x40, 0x40, 0x40, 0x3F],
  'V': [0x1F, 0x20, 0x40, 0x20, 0x1F],
  'W': [0x3F, 0x40, 0x38, 0x40, 0x3F],
  'X': [0x63, 0x14, 0x08, 0x14, 0x63],
  'Y': [0x07, 0x08, 0x70, 0x08, 0x07],
  'Z': [0x61, 0x51, 0x49, 0x45, 0x43],
  '0': [0x3E, 0x51, 0x49, 0x45, 0x3E],
  '1': [0x00, 0x42, 0x7F, 0x40, 0x00],
  '2': [0x42, 0x61, 0x51, 0x49, 0x46],
  '3': [0x21, 0x41, 0x45, 0x4B, 0x31],
  '4': [0x18, 0x14, 0x12, 0x7F, 0x10],
  '5': [0x27, 0x45, 0x45, 0x45, 0x39],
  '6': [0x3C, 0x4A, 0x49, 0x49, 0x30],
  '7': [0x01, 0x71, 0x09, 0x05, 0x03],
  '8': [0x36, 0x49, 0x49, 0x49, 0x36],
  '9': [0x06, 0x49, 0x49, 0x29, 0x1E],
  ':': [0x00, 0x36, 0x36, 0x00, 0x00],
  '/': [0x20, 0x10, 0x08, 0x04, 0x02],
  '_': [0x40, 0x40, 0x40, 0x40, 0x40],
  '!': [0x00, 0x00, 0x5F, 0x00, 0x00],
  '?': [0x02, 0x01, 0x51, 0x09, 0x06],
  '.': [0x00, 0x60, 0x60, 0x00, 0x00],
  ',': [0x00, 0x80, 0x60, 0x00, 0x00],
  '-': [0x08, 0x08, 0x08, 0x08, 0x08],
  '(': [0x00, 0x1C, 0x22, 0x41, 0x00],
  ')': [0x00, 0x41, 0x22, 0x1C, 0x00],
  '|': [0x00, 0x00, 0x7F, 0x00, 0x00],
};

export function drawChar(canvas: boolean[][], char: string, x: number, y: number, scale: number = 1): void {
  const charData = FONT_5X7[char.toUpperCase()] || FONT_5X7['?'];
  
  for (let col = 0; col < 5; col++) {
    const column = charData[col];
    for (let row = 0; row < 7; row++) {
      if (column & (1 << row)) {
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            const px = x + col * scale + sx;
            const py = y + row * scale + sy;
            if (px >= 0 && px < canvas[0].length && py >= 0 && py < canvas.length) {
              canvas[py][px] = true;
            }
          }
        }
      }
    }
  }
}

export function drawText(canvas: boolean[][], text: string, x: number, y: number, scale: number = 1, spacing: number = 1): void {
  let currentX = x;
  for (const char of text) {
    drawChar(canvas, char, currentX, y, scale);
    currentX += (6 * scale) + spacing;
  }
}

export function getTextWidth(text: string, scale: number = 1, spacing: number = 1): number {
  return text.length * (6 * scale + spacing) - spacing;
}

export function getTextHeight(scale: number = 1): number {
  return 7 * scale;
}