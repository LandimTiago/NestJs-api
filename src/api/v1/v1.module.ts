import { Module } from '@nestjs/common';
import { Routes } from 'nest-router';
import { ItemModule } from './item/item.module';
import { UserModule } from './user/user.module';

export const routesV1: Routes = [
  {
    path: '/user',
    module: UserModule,
  },
  {
    path: '/item',
    module: ItemModule,
  },
];

@Module({
  imports: [UserModule, ItemModule],
})
export class V1Module {}
