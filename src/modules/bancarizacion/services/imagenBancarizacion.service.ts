import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ImagenBancarizacion } from '../entities/imagen_bancarizacion.entity';
import { identity } from 'rxjs';
import moment from 'moment-timezone';

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

		const now = new Date();
		now.setHours(now.getHours() - 5);

		imagen.created_at = now;
		imagen.updated_at = now;
		return await this.imagenBancarizacionRepository.save(imagen);
	}

	async findAll(UserId: number) {
		const startOfDay = new Date();
		startOfDay.setHours(startOfDay.getHours() - 5, 0, 0, 0);

		const endOfDay = new Date();
		endOfDay.setHours(endOfDay.getHours() + 18, 59, 59, 999);
		return await this.imagenBancarizacionRepository.find({
			where: {
				user_id: UserId,
				created_at: Between(startOfDay, endOfDay),
			},
		});
	}
}
