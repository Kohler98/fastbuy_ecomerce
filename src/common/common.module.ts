import { Module } from '@nestjs/common';
import { DataBaseModule } from './dataBase/dataBase.module';

@Module({
    imports:[DataBaseModule]
})
export class CommonModule {}
