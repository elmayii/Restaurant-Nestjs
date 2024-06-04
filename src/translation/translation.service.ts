import { Injectable } from '@nestjs/common';

@Injectable()
export class TranslationService {
  private apiUrl = 'https://libretranslate.com/translate';

  async translate() {}
}
