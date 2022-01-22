import { NestFactory } from '@nestjs/core';
import rateLimit from 'express-rate-limit';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/api')
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 minutes
      max: 10000, // limit each IP to 1000 requests per windowMs
    })
  );
  app.use(compression()); // 启用 gzip 压缩
  app.use(helmet.xssFilter()); //安全中间件
  app.useGlobalInterceptors(new TransformInterceptor()); // 正常情况下，响应值统一
  app.useGlobalFilters(new HttpExceptionFilter()); // 异常情况下，响应值统一
  app.use(bodyParser.json({ limit: '10mb' })); // 修改请求的容量
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  const swaggerOptions = new DocumentBuilder()
    .setTitle('nest-blog api document')
    .setDescription('博客api接口')
    .setVersion('1.0.0')
    .addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup('doc', app, document)

  await app.listen(3000);
}
bootstrap();
