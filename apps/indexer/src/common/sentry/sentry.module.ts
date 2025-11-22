import { Module, Global } from '@nestjs/common';
import { initSentry } from './sentry.config';

@Global()
@Module({})
export class SentryModule {
  constructor() {
    // Initialize Sentry when module is loaded
    initSentry();
  }
}
