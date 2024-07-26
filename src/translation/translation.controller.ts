import { Controller, Get, Query } from '@nestjs/common';
import { TranslationService } from './translation.service';

@Controller('translate')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Get()
  async translate(
    @Query('text') text: string,
    @Query('source') sourceLang: string,
    @Query('target') targetLang: string,
  ): Promise<string> {
    // console.log(text);
    // console.log(sourceLang);
    // console.log(targetLang);
    return this.translationService.translateText(text, sourceLang, targetLang);
  }
}
