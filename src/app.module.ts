import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApiModule } from './api/api.module';
import { InfraModule } from './infra/infra.module';

@Module({
  imports: [InfraModule, ApiModule],
  controllers: [AppController],
})
export class AppModule {}
