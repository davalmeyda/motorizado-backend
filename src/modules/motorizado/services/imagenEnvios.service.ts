import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagenEnvio } from '../entities/imagenEnvios.entity';
import { DireccionDetalleImagenes } from '../entities/direccionDetalleImagenes.entity';

@Injectable()
export class ImagenEnviosService {
	constructor(
		@InjectRepository(ImagenEnvio) private readonly imagenEnvioRespository: Repository<ImagenEnvio>,
		@InjectRepository(DireccionDetalleImagenes)
		private readonly direccionDetalleImagenesRespository: Repository<DireccionDetalleImagenes>,
	) {}

	async create(direccion_id: number, url: string, user_id: number = null) {
		const imagen: ImagenEnvio = new ImagenEnvio();
		imagen.url_imagen = url;
		imagen.user_id = user_id;
		imagen.direccion_id = direccion_id;
		imagen.created_at = new Date();
		const imagenCreada = await this.imagenEnvioRespository.save(imagen);
		const direccionDetalleImagenes = new DireccionDetalleImagenes();
		direccionDetalleImagenes.id_direccion_detalle = direccion_id;
		direccionDetalleImagenes.id_imagen_envio = imagenCreada.id;
		direccionDetalleImagenes.created_at = new Date();
		await this.direccionDetalleImagenesRespository.save(direccionDetalleImagenes);
		return imagenCreada;
	}
}
