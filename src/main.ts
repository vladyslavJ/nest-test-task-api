import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
// Убираем импорт ValidationPipe
// import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Включаем CORS
  app.enableCors()

  // Убираем глобальный ValidationPipe
  // app.useGlobalPipes(new ValidationPipe({ transform: true }))

  // Настраиваем Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('NestJS Test Task API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  // Получаем порт из конфигурации или используем 3000
  const configService = app.get(ConfigService)
  const port = configService.get('PORT') || 3000

  await app.listen(port)
  console.log(`Application is running on: http://localhost:${port}`)
  console.log(`Swagger documentation: http://localhost:${port}/api`)
}
bootstrap()
