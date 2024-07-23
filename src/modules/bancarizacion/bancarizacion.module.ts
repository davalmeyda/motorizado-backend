import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './services/user.service';
import { UserController } from './controller/user.controller';
import { PedidoController } from './controller/pedido.controller';
import { PedidoService } from './services/pedido.service';
import { Pedido } from './entities/pedido.entity';
import { User } from './entities/user.entity';
import { DetallePedido } from './entities/detalle_pedido.entity';
import { PedidosAnulacion } from './entities/pedidos_anulacion.entity';
import { AutorizacionBancaDigital } from './entities/autorizacion_banca.entity';
import { AutorizacionBancaDigitalImagenes } from './entities/autorizacion_banca_imagenes.entity';
import { ImagenBancarizacionService } from './services/imagenBancarizacion.service';
import { ImagenBancarizacion } from './entities/imagen_bancarizacion.entity';
import { OperacionOficinaService } from './services/operacionesOficinas.service';
import { OperacionOficina } from './entities/operaciones_oficinas.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			User,
			Pedido,
			DetallePedido,
			PedidosAnulacion,
			AutorizacionBancaDigital,
			AutorizacionBancaDigitalImagenes,
			ImagenBancarizacion,
			OperacionOficina,
		]),
	],
	providers: [UserService, PedidoService,ImagenBancarizacionService,OperacionOficinaService],
	controllers: [UserController, PedidoController],
})
export class BancarizacionModule {}
