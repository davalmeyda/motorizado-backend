import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagenEnvio } from '../entities/imagenEnvios.entity';
import { Pedido } from '../entities/pedido.entity';
// import { PedidoDto } from '../dtos/pedido.dto';

@Injectable()
export class ImagenEnviosService {
	constructor(
		@InjectRepository(ImagenEnvio) private readonly imagenEnvioRespository: Repository<ImagenEnvio>,
	) {}

	async create(pedido: Pedido, url: string, user_id: number = null) {
		const imagen: ImagenEnvio = new ImagenEnvio();
		imagen.url_imagen = url;
		imagen.user_id = user_id;
		imagen.direccion_id = pedido.direccionDt.direccion.id;
		return await this.imagenEnvioRespository.create(imagen);
	}
}
