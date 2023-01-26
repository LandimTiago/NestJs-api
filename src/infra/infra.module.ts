import { Module } from '@nestjs/common';
import { DatabaseModule } from './connections/database.module';

@Module({
  imports: [DatabaseModule],
})
export class InfraModule {}
