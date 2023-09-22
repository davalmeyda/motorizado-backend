import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { RolService } from './services/rol.service';
import { RolController } from './controller/rol.controller';
import { User } from './entities/user.entity';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';

@Module({
	imports: [TypeOrmModule.forFeature([Rol,User])],
	providers: [RolService,UserService],
	controllers: [RolController,UserController],
})
export class MotorizadoModule {}
