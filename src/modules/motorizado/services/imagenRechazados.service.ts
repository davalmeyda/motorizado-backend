import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagenRechazado } from '../entities/imagenRechazado.entity';

@Injectable()
export class ImagenRechazadosService {
	constructor(
		@InjectRepository(ImagenRechazado)
		private readonly imagenReprogramadoRespository: Repository<ImagenRechazado>,
	) {}

	async create(rechazado_id: number, url: string, name: string) {
		const lastIdImagen =
			parseInt(
				await this.imagenReprogramadoRespository.query(
					`SELECT MAX(id) as id FROM envios_no_entregado_fotos`,
				)[0].id,
			) + 1;

		const imagen: ImagenRechazado = new ImagenRechazado();
		imagen.url = url;
		imagen.name = name;
		imagen.id = lastIdImagen;
		imagen.id_no_entregado = rechazado_id;
		imagen.created_at = new Date();
		return await this.imagenReprogramadoRespository.save(imagen);
	}
}
