import { Module } from '@nestjs/common';
import { RouterModule, Routes } from 'nest-router';
import { ItemModule } from './v1/item/item.module';
import { UserModule } from './v1/user/user.module';
import { routesV1, V1Module } from './v1/v1.module';

const routes: Routes = [
  {
    path: '/v1',
    module: V1Module,
    children: routesV1,
  },
];

@Module({
  imports: [RouterModule.forRoutes(routes), ItemModule, UserModule],
})
export class ApiModule {}
