import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ImagenBancarizacion } from '../entities/imagen_bancarizacion.entity';
import { identity } from 'rxjs';

@Injectable()
export class ImagenBancarizacionService {
	constructor(
		@InjectRepository(ImagenBancarizacion)
		private readonly imagenBancarizacionRepository: Repository<ImagenBancarizacion>,
	) {}

	async create(
		pedido_id: number,
		user_id: number,
		name: string,
		url: string,
		cant_vouchers: number,
		pdf: any,
	) {
		const lastIdEnvio = await this.imagenBancarizacionRepository.query(
			`SELECT MAX(id) as id FROM imagen_bancarizacion`,
		);

		const imagen: ImagenBancarizacion = new ImagenBancarizacion();
		imagen.id = parseInt(lastIdEnvio[0].id ?? 0) + 1;
		imagen.pedido_id = pedido_id;
		imagen.user_id = user_id;
		imagen.name = name;
		imagen.url = url;
		imagen.cant_vouchers = cant_vouchers;
		imagen.pdf_size = pdf;
		imagen.created_at = new Date();
		imagen.updated_at = new Date();
		return await this.imagenBancarizacionRepository.save(imagen);
	}

	async findAll(UserId: number) {
		const startOfDay = new Date();
		startOfDay.setHours(0, 0, 0, 0);
		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999);
		return await this.imagenBancarizacionRepository.find({
			where: {
				user_id: UserId,
				created_at: Between(startOfDay, endOfDay),
			},
		});
	}
}
