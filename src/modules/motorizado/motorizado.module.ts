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
import { Ubicacion } from './entities/ubicaciones.entity';
import { Cliente } from './entities/cliente.entity';
import { Agencia } from './entities/agencias.entity';
import { ImagenEnviosService } from './services/imagenEnvios.service';
import { ImagenEnvio } from './entities/imagenEnvios.entity';
import { ImagenReprogramadoService } from './services/imagenReprogramados.service';
import { ImagenReprogramado } from './entities/imagenReprogramado.entity';
import { EnviosReprogramaciones } from './entities/enviosReprogramaciones.entity';
import { DireccionDetalleImagenes } from './entities/direccionDetalleImagenes.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Rol,
			User,
			Pedido,
			Direccion,
			DireccionDT,
			Ubicacion,
			Cliente,
			Agencia,
			ImagenEnvio,
			EnviosReprogramaciones,
			ImagenReprogramado,
			DireccionDetalleImagenes,
		]),
	],
	providers: [
		RolService,
		UserService,
		PedidoService,
		ImagenEnviosService,
		ImagenReprogramadoService,
	],
	controllers: [RolController, UserController, PedidoController],
})
export class MotorizadoModule {}
