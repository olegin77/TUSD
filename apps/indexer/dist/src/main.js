"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const sentry_config_1 = require("./common/sentry/sentry.config");
async function bootstrap() {
    (0, sentry_config_1.initSentry)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
    });
    const port = process.env.API_PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Indexer running on port ${port}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map