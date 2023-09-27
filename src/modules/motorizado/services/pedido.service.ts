import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from '../entities/pedido.entity';
import { ILike, In, Repository } from 'typeorm';
import { CodigosDto } from '../dtos/pedido.dto';
import { Direccion } from '../entities/direcciones.entity';
// import { PedidoDto } from '../dtos/pedido.dto';

@Injectable()
export class PedidoService {
	constructor(
		@InjectRepository(Pedido) private readonly pedidoRespository: Repository<Pedido>,
		@InjectRepository(Direccion) private readonly direccionRespository: Repository<Direccion>,
	) {}

	findAll(search: string) {
		return this.pedidoRespository.findAndCount({
			relations: ['direccionDt', 'direccionDt.direccion'],
			where: [
				{
					correlativo: ILike('%' + (search || '') + '%'),
				},
				{
					codigo: ILike('%' + (search || '') + '%'),
				},
			],
		});
	}

	findAllPendientes(search: string) {
		return this.pedidoRespository.findAndCount({
			relations: ['direccionDt', 'direccionDt.direccion'],
			where: [
				{
					correlativo: ILike('%' + (search || '') + '%'),
					direccionDt: { direccion: { recibido: '0' } },
				},
				{
					codigo: ILike('%' + (search || '') + '%'),
					direccionDt: { direccion: { recibido: '0' } },
				},
			],
		});
	}

	findAllRecibidos(search: string) {
		return this.pedidoRespository.findAndCount({
			relations: ['direccionDt', 'direccionDt.direccion'],
			where: [
				{
					correlativo: ILike('%' + (search || '') + '%'),
					direccionDt: { direccion: { recibido: '1' } },
				},
				{
					codigo: ILike('%' + (search || '') + '%'),
					direccionDt: { direccion: { recibido: '1' } },
				},
			],
		});
	}

	findOne(cod: string) {
		return this.pedidoRespository.findOne({
			relations: ['direccionDt', 'direccionDt.direccion'],
			where: { codigo: cod },
		});
	}

	async changeStatus(codigosDto: CodigosDto) {
		const pedidos = await this.pedidoRespository.find({
			relations: ['direccionDt', 'direccionDt.direccion'],
			where: { codigo: In(codigosDto.codigos) },
		});
		const ids = [];
		pedidos.forEach(pedido => {
			ids.push(pedido.direccionDt.direccion.id);
		});
		return this.direccionRespository.update({ id: In(ids) }, { recibido: '1' });
	}
}
