import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagenBancarizacion } from '../entities/imagen_bancarizacion.entity';

@Injectable()
export class ImagenBancarizacionService {
	constructor(
		@InjectRepository(ImagenBancarizacion)
		private readonly imagenBancarizacionRepository: Repository<ImagenBancarizacion>,
	) {}

	async create(pedido_id: number,user_id: number, name: string, url: string) {
		const imagen: ImagenBancarizacion = new ImagenBancarizacion();
		imagen.pedido_id = pedido_id;
		imagen.user_id = user_id;
        imagen.name = name;
        imagen.url = url;
		imagen.created_at = new Date();
		imagen.updated_at = new Date();
		return await this.imagenBancarizacionRepository.save(imagen);
	}
}
