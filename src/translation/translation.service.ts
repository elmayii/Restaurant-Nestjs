import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TranslationService {
  private readonly apiKey = process.env.GOOGLE_API;

  async translateText(
    text: string,
    sourceLang: string,
    targetLang: string,
  ): Promise<string> {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`;
    const payload = {
      q: text,
      target: targetLang,
      source: sourceLang,
    };
    try {
      const response = await axios.post(url, payload);
      const translatedText = response.data.data.translations[0].translatedText;
      return translatedText;
    } catch (error) {
      console.log('Error: ', error);
      throw error;
    }
  }
}
