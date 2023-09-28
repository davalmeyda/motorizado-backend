import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from '../entities/pedido.entity';
import { ILike, In, Repository } from 'typeorm';
import { CodigosDto } from '../dtos/pedido.dto';
import { Direccion } from '../entities/direcciones.entity';
import { Cliente } from '../entities/cliente.entity';
import { Ubicacion } from '../entities/ubicaciones.entity';
import { Agencia } from '../entities/agencias.entity';
// import { PedidoDto } from '../dtos/pedido.dto';

@Injectable()
export class PedidoService {
	constructor(
		@InjectRepository(Pedido) private readonly pedidoRespository: Repository<Pedido>,
		@InjectRepository(Direccion) private readonly direccionRespository: Repository<Direccion>,
		@InjectRepository(Cliente) private readonly clienteRespository: Repository<Cliente>,
		@InjectRepository(Ubicacion) private readonly ubicacionRespository: Repository<Ubicacion>,
		@InjectRepository(Agencia) private readonly agenciaRespository: Repository<Agencia>,
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

	findAllPendientes(search: string, idUser: number) {
		return this.pedidoRespository.findAndCount({
			relations: ['direccionDt', 'direccionDt.direccion'],
			where: [
				{
					correlativo: ILike('%' + (search || '') + '%'),
					direccionDt: {
						direccion: [{ recibido: 0, id_motorizado: idUser }, { recibido: 0 }],
					},
				},
				{
					codigo: ILike('%' + (search || '') + '%'),
					direccionDt: [
						{ direccion: { recibido: 0, id_motorizado: idUser } },
						{ direccion: { recibido: 0, id_motorizado: idUser } },
					],
				},
			],
		});
	}

	findAllRecibidos(search: string, idUser: number) {
		const direccionDt = [
			{ direccion: { id_ubicacion: 1, recibido: 1, id_motorizado: idUser, entregado: 0 } },
			{ direccion: { id_agencia: 3, recibido: 1, id_motorizado: idUser, entregado: 0 } },
		];

		return this.pedidoRespository.findAndCount({
			relations: ['direccionDt', 'direccionDt.direccion'],
			where: [
				{
					correlativo: ILike('%' + (search || '') + '%'),
					direccionDt,
				},
				{
					codigo: ILike('%' + (search || '') + '%'),
					direccionDt,
				},
			],
		});
	}

	async findOne(cod: string) {
		const pedido = await this.pedidoRespository.findOne({
			relations: ['direccionDt', 'direccionDt.direccion'],
			where: {
				codigo: cod,
			},
		});
		if (!pedido) throw new Error('No se encontro el pedido');
		const cliente = await this.clienteRespository.findOne({
			where: { id: pedido?.direccionDt?.direccion?.id_cliente },
		});
		const ubicacion = await this.ubicacionRespository.findOne({
			where: { id: pedido?.direccionDt?.direccion?.id_ubicacion },
		});
		const agencia = await this.agenciaRespository.findOne({
			where: { id: pedido?.direccionDt?.direccion?.id_agencia },
		});

		return { pedido, cliente, ubicacion, agencia };
	}

	async changeStatus(codigosDto: CodigosDto) {
		const pedidos = await this.pedidoRespository.find({
			relations: ['direccionDt', 'direccionDt.direccion'],
			where: { codigo: In(codigosDto.codigos) },
		});
		if (!pedidos || pedidos.length === 0)
			throw new Error('No se encontraron pedidos con los codigos enviados');
		const ids = [];
		pedidos
			.filter(p => (p.direccionDt ? true : false))
			.filter(p => p.direccionDt.direccion.id_motorizado === codigosDto.idUser)
			.forEach(pedido => {
				ids.push(pedido.direccionDt.direccion.id);
			});
		if (ids.length === 0)
			throw new Error('No se encontraron pedidos con los codigos enviados para este usuario');
		return this.direccionRespository.update({ id: In(ids) }, { recibido: 1 });
	}

	async changeStatusEntregado(codigo: string, idUser: number, importe: number = 0) {
		console.log(importe);
		const pedido = await this.pedidoRespository.findOne({
			relations: ['direccionDt', 'direccionDt.direccion'],
			where: { codigo, direccionDt: { direccion: { id_motorizado: idUser } } },
		});
		const id = pedido.direccionDt.direccion.id;
		return this.direccionRespository.update({ id }, { entregado: 1 });
	}
}
