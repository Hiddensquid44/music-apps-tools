export class Utils {
  public static shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  public static encodeBase64(input: string): string {
    if (typeof btoa !== 'undefined') {
      return btoa(input);
    }
    // Fallback for server-side (Node) environments where Buffer is available.
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(input, 'utf8').toString('base64');
    }
    // Last-resort: rudimentary base64 (shouldn't be reached in normal environments)
    try {
      return globalThis.btoa(input);
    } catch (e) {
      console.warn('Base64 encoding fallback used; output may be incorrect.', e);
      return '';
    }
  }

  public static generateRandomString(length: number): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}