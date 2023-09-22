import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { RolService } from './services/rol.service';
import { RolController } from './controller/rol.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Rol])],
	providers: [RolService],
	controllers: [RolController],
})
export class MotorizadoModule {}
