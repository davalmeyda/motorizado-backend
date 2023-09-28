import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagenReprogramado } from '../entities/imagenReprogramado.entity';
// import { PedidoDto } from '../dtos/pedido.dto';

@Injectable()
export class ImagenReprogramadoService {
	constructor(
		@InjectRepository(ImagenReprogramado)
		private readonly imagenReprogramadoRespository: Repository<ImagenReprogramado>,
	) {}

	async create(reprogramacion: number, url: string, name: string) {
		const imagen: ImagenReprogramado = new ImagenReprogramado();
		imagen.url = url;
		imagen.name = name;
		imagen.id_reprog = reprogramacion;
		imagen.created_at = new Date();
		return await this.imagenReprogramadoRespository.save(imagen);
	}
}
