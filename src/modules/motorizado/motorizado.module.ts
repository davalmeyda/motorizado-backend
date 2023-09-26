import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { RolService } from './services/rol.service';
import { RolController } from './controller/rol.controller';
import { User } from './entities/user.entity';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';
import { Pedido } from './entities/pedido.entity';
import { PedidoController } from './controller/pedido.controller';
import { PedidoService } from './services/pedido.service';
import { Direccion } from './entities/direcciones.entity';
import { DireccionDT } from './entities/direccionesdt.entity';


@Module({
	imports: [TypeOrmModule.forFeature([Rol, User, Pedido, Direccion, DireccionDT])],
	providers: [RolService, UserService, PedidoService],
	controllers: [RolController, UserController, PedidoController],
})
export class MotorizadoModule { }
