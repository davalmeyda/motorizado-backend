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

		const lastIdEnvio = await this.imagenBancarizacionRepository.query(
			`SELECT MAX(id) as id FROM imagen_bancarizacion`,
		);

		const imagen: ImagenBancarizacion = new ImagenBancarizacion();
		imagen.id = parseInt(lastIdEnvio[0].id) + 1
		imagen.pedido_id = pedido_id;
		imagen.user_id = user_id;
        imagen.name = name;
        imagen.url = url;
		imagen.created_at = new Date();
		imagen.updated_at = new Date();
		return await this.imagenBancarizacionRepository.save(imagen);
	}
}
