import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from '../entities/pedido.entity';
import { FindOptionsWhere, ILike, In, IsNull, Not, Repository } from 'typeorm';
import { CodigosDto, PedidoTransaccionDto } from '../dtos/pedido.dto';
import { Direccion } from '../entities/direcciones.entity';
import { Cliente } from '../entities/cliente.entity';
import { Ubicacion } from '../entities/ubicaciones.entity';
import { Agencia } from '../entities/agencias.entity';
import { EnviosReprogramaciones } from '../entities/enviosReprogramaciones.entity';
import { DireccionDT } from '../entities/direccionesdt.entity';
import { EnviosRechazados } from '../entities/enviosRechazados.entity';
import { ImagenEnviosService } from './imagenEnvios.service';

const CONFIRM_MOTORIZADO_INT = 16;
const CONFIRM_MOTORIZADO = 'PRE* ENTREGADO A CLIENTE - MOTORIZADO';

const EN_AGENCIA_COURIER_INT = 42;
const EN_AGENCIA_COURIER = 'EN AGENCIA - COURIER';

const PRE_ENTREGADO_PARCIAL_INT = 44;
const PRE_ENTREGADO_PARCIAL = 'PRE ENTREGADO PARCIAL - COURIER';

const ENVIO_NO_ENTREGADO_INT = 45;
const ENVIO_NO_ENTREGADO = 'NO ENTREGADO - COURIER';

const ENVIO_REPROGRAMADO_INT = 46;
const ENVIO_REPROGRAMADO = 'PEDIDO REPROGRAMADO';

@Injectable()
export class PedidoService {
	constructor(
		@InjectRepository(Pedido) private readonly pedidoRespository: Repository<Pedido>,
		@InjectRepository(Direccion) private readonly direccionRespository: Repository<Direccion>,
		@InjectRepository(DireccionDT) private readonly direccionDtRespository: Repository<DireccionDT>,
		@InjectRepository(Cliente) private readonly clienteRespository: Repository<Cliente>,
		@InjectRepository(Ubicacion) private readonly ubicacionRespository: Repository<Ubicacion>,
		@InjectRepository(Agencia) private readonly agenciaRespository: Repository<Agencia>,
		@InjectRepository(EnviosReprogramaciones)
		private readonly enviosReprogramacionRespository: Repository<EnviosReprogramaciones>,
		@InjectRepository(EnviosRechazados)
		private readonly enviosRechazadosRespository: Repository<EnviosRechazados>,
		private readonly imagenEnviosService: ImagenEnviosService,
	) {}

	findAll(search: string) {
		try {
			return this.direccionRespository.findAndCount({
				relations: ['direciones', 'direciones.pedido'],
				where: [
					{
						direciones: {
							pedido: [
								{
									correlativo: ILike('%' + (search || '') + '%'),
								},
								{
									codigo: ILike('%' + (search || '')),
								},
							],
							eliminado: 0,
						},
					},
				],
			});
		} catch (error) {
			throw new NotFoundException(error);
		}
	}

	async findAllPendientes(search: string, idUser: number) {
		try {
			const direcciones = {
				pedido: [
					{
						correlativo: ILike('%' + (search || '') + '%'),
					},
					{
						codigo: ILike('%' + (search || '')),
					},
				],
				eliminado: 0,
			};
			const where: FindOptionsWhere<Direccion>[] = [
				{
					recibido: Not(2),
					id_motorizado: idUser,
					direciones: direcciones,
					fecha_asig_motorizado: Not(IsNull()),
				},
			];
			const resp = await this.direccionRespository.findAndCount({
				relations: ['direciones', 'direciones.pedido', 'reprogramaciones'],
				where,
			});
			const arrDireccionesResp = [];
			for (const direccion of resp[0]) {
				let ubicacion: Ubicacion = null;
				let agencia: Agencia = null;
				if (direccion.id_ubicacion) {
					ubicacion = await this.ubicacionRespository.findOne({
						where: { id: direccion.id_ubicacion },
					});
				}
				if (direccion.id_agencia) {
					agencia = await this.agenciaRespository.findOne({
						where: { id: direccion.id_agencia },
					});
				}
				arrDireccionesResp.push({
					...direccion,
					agencia: agencia?.nombre_agencia,
					ubicacion: ubicacion?.nombre_ubicacion,
				});
			}
			return [arrDireccionesResp, arrDireccionesResp.length];
		} catch (error) {
			throw new NotFoundException(error);
		}
	}

	async findAllRecibidos(search: string, idUser: number) {
		try {
			const direciones = {
				pedido: [
					{
						correlativo: ILike('%' + (search || '') + '%'),
					},
					{
						codigo: ILike('%' + (search || '')),
					},
				],
				eliminado: 0,
			};
			const respDirecciones = await this.direccionRespository.findAndCount({
				relations: ['direciones', 'direciones.pedido', 'reprogramaciones', 'noEntregados'],
				where: [
					{
						id_ubicacion: 1,
						recibido: In([1, 2]),
						id_motorizado: idUser,
						entregado: Not(2),
						direciones,
					},
					{
						id_agencia: 3,
						recibido: In([1, 2]),
						id_motorizado: idUser,
						entregado: Not(2),
						direciones,
					},
				],
			});
			const arrDirecciones = [];
			respDirecciones[0].forEach(direccion => {
				if (direccion.noEntregados.length === 0) {
					direccion.direciones.forEach(dir => {
						if (dir.entregado !== 1 && dir.recibido === 1) {
							arrDirecciones.push(direccion);
						}
					});
				}
			});
			const arrNoRepetidos = [];
			arrDirecciones.forEach(direccion => {
				if (arrNoRepetidos.findIndex(dir => dir.id === direccion.id) === -1) {
					arrNoRepetidos.push(direccion);
				}
			});

			const arrDireccionesResp = [];
			for (const direccion of arrNoRepetidos) {
				let ubicacion: Ubicacion = null;
				let agencia: Agencia = null;
				if (direccion.id_ubicacion) {
					ubicacion = await this.ubicacionRespository.findOne({
						where: { id: direccion.id_ubicacion },
					});
				}
				if (direccion.id_agencia) {
					agencia = await this.agenciaRespository.findOne({
						where: { id: direccion.id_agencia },
					});
				}
				arrDireccionesResp.push({
					...direccion,
					agencia: agencia?.nombre_agencia,
					ubicacion: ubicacion?.nombre_ubicacion,
				});
			}
			return [arrDireccionesResp, arrDireccionesResp.length];
		} catch (error) {
			throw new NotFoundException(error);
		}
	}

	async findOne(cod: string) {
		try {
			const direccion = await this.direccionRespository.findOne({
				relations: ['direciones', 'direciones.pedido', 'reprogramaciones'],
				where: {
					direciones: { pedido: { codigo: cod }, eliminado: 0 },
				},
			});
			if (!direccion) throw new NotFoundException('No se encontro el pedido');
			const cliente = await this.clienteRespository.findOne({
				where: { id: direccion.id_cliente },
			});
			const ubicacion = await this.ubicacionRespository.findOne({
				where: { id: direccion.id_ubicacion },
			});
			const agencia = await this.agenciaRespository.findOne({
				where: { id: direccion.id_agencia },
			});

			return { direccion, cliente, ubicacion, agencia };
		} catch (error) {
			throw new NotFoundException(error);
		}
	}

	async findOneDireccion(id: string) {
		try {
			const direccion = await this.direccionRespository.findOne({
				relations: ['direciones', 'direciones.pedido', 'reprogramaciones'],
				where: {
					id: parseInt(id, 10),
					direciones: { eliminado: 0 },
				},
			});
			if (!direccion) throw new NotFoundException('No se encontro el pedido');
			const cliente = await this.clienteRespository.findOne({
				where: { id: direccion.id_cliente },
			});
			const ubicacion = await this.ubicacionRespository.findOne({
				where: { id: direccion.id_ubicacion },
			});
			const agencia = await this.agenciaRespository.findOne({
				where: { id: direccion.id_agencia },
			});

			return { direccion, cliente, ubicacion, agencia };
		} catch (error) {
			throw new NotFoundException(error);
		}
	}

	async findOneToDeliver(cod: string) {
		try {
			const pedido = await this.pedidoRespository.findOne({
				relations: [
					'direccionDt',
					'direccionDt.direccion',
					'direccionDt.direccion.reprogramaciones',
				],
				where: { codigo: cod, direccionDt: { eliminado: 0 } },
			});
			if (!pedido) throw new NotFoundException('No se encontro el pedido');
			if (!pedido.direccionDt) throw new NotFoundException('No tiene dirección');
			if (!pedido.direccionDt.direccion) throw new NotFoundException('No tiene dirección');
			if (pedido.direccionDt.entregado) throw new NotFoundException('El pedido ya fue entregado');
			if (pedido.direccionDt.recibido != 1)
				throw new NotFoundException('No se puede entregar el pedido');
			const direccion = await this.direccionRespository.findOne({
				relations: ['direciones', 'direciones.pedido', 'reprogramaciones'],
				where: {
					direciones: { pedido: { codigo: cod }, eliminado: 0 },
				},
			});
			if (!direccion) throw new NotFoundException('No se encontro el pedido');

			let cliente;
			if (direccion.id_cliente !== null) {
				cliente = await this.clienteRespository.findOne({
					where: { id: direccion.id_cliente },
				});
			}
			let ubicacion;
			if (direccion.id_ubicacion !== null) {
				ubicacion = await this.ubicacionRespository.findOne({
					where: { id: direccion.id_ubicacion },
				});
			}
			let agencia;
			if (direccion.id_agencia !== null) {
				agencia = await this.agenciaRespository.findOne({
					where: { id: direccion.id_agencia },
				});
			}

			const direccionConPedidos = await this.direccionRespository.findOne({
				relations: ['direciones', 'direciones.pedido', 'reprogramaciones'],
				where: {
					id: direccion.id,
					direciones: {
						recibido: Not(0),
						eliminado: 0,
					},
				},
			});

			return { direccion: direccionConPedidos, cliente, ubicacion, agencia };
		} catch (error) {
			throw new NotFoundException(error);
		}
	}

	async consultaCodigo(cod: string, idUser: string) {
		try {
			const pedido = await this.pedidoRespository.findOne({
				relations: [
					'direccionDt',
					'direccionDt.direccion',
					'direccionDt.direccion.reprogramaciones',
				],
				where: [
					{
						codigo: cod,
						direccionDt: { eliminado: 0 },
					},
				],
			});
			if (!pedido) throw new NotFoundException('No se encontró el codigo');
			if (!pedido.direccionDt) throw new NotFoundException('No tiene dirección');
			if (!pedido.direccionDt.direccion) throw new NotFoundException('No tiene dirección');
			if (!pedido.direccionDt.direccion.id_motorizado)
				throw new NotFoundException('No tiene permisos para acceder a este pedido');
			if (pedido.direccionDt.direccion.id_motorizado !== parseInt(idUser, 10))
				throw new NotFoundException('No tiene permisos para acceder a este pedido');
			return pedido;
		} catch (error) {
			throw new NotFoundException(error);
		}
	}

	async changeStatus(codigosDto: CodigosDto) {
		try {
			const pedidos = await this.pedidoRespository.find({
				relations: ['direccionDt', 'direccionDt.direccion'],
				where: { codigo: In(codigosDto.codigos), direccionDt: { eliminado: 0 } },
			});
			if (!pedidos || pedidos.length === 0)
				throw new NotFoundException('No se encontraron pedidos con los codigos enviados');
			const ids = [];
			if (
				pedidos.some(p => p.direccionDt === null) ||
				pedidos.some(p => p.direccionDt.direccion === null)
			) {
				throw new NotFoundException('No se puede cambiar el estado de los pedidos sin dirección');
			}
			pedidos
				.filter(p => (p.direccionDt ? true : false))
				.filter(p => (p.direccionDt.direccion ? true : false))
				.filter(p => p.direccionDt?.direccion?.id_motorizado === codigosDto.idUser)
				.forEach(pedido => {
					ids.push(pedido.direccionDt.direccion.id);
				});
			if (ids.length === 0)
				throw new NotFoundException(
					'No se encontraron pedidos con los codigos enviados para este usuario',
				);

			for (const pedido of pedidos) {
				// * Cambiar estado de los pedidos
				await this.pedidoRespository.update(
					{ id: pedido.id },
					{
						condicion_envio: 'MOTORIZADO EN RUTA',
						condicion_envio_code: 20,
					},
				);
				await this.direccionDtRespository.update(
					{ id: pedido.direccionDt.id },
					{ recibido: 1, fecha_recibido: new Date() },
				);
			}

			// * Cambiar estado de la direccion solo cuando todos los pedidos hayan sido entregados
			for (const id of ids) {
				const pedidos = await this.pedidoRespository.find({
					relations: ['direccionDt', 'direccionDt.direccion'],
					where: { direccionDt: { direccion: { id } } },
				});
				const recibidos = pedidos.filter(p => p.direccionDt.recibido === 1);
				if (pedidos.length === recibidos.length) {
					await this.direccionRespository.update(
						{ id },
						{ recibido: 2, estado_dir: 'MOTORIZADO EN RUTA', estado_dir_code: 20 },
					);
				} else {
					await this.direccionRespository.update(
						{ id },
						{ recibido: 1, estado_dir: 'MOTORIZADO EN RUTA', estado_dir_code: 20 },
					);
				}
			}
			return this.direccionRespository.find({
				relations: ['direciones', 'direciones.pedido', 'reprogramaciones'],
				where: { id: In(ids) },
			});
		} catch (error) {
			throw new NotFoundException(error);
		}
	}

	async changeStatusEntregadoTransaccion(dto: PedidoTransaccionDto) {
		try {
			if (!dto.idUser) throw new NotFoundException('Debe tener el id del usuario');
			if (dto.importe === undefined || dto.importe === null)
				throw new NotFoundException('Debe tener un importe');

			const direccion = await this.direccionRespository.findOne({
				relations: ['direciones', 'direciones.pedido', 'reprogramaciones'],
				where: { id: dto.direccionId, direciones: { eliminado: 0 }, estado: 1 },
			});
			if (!direccion) throw new NotFoundException('No se encontro la dirección');
			if (direccion.entregado === 2) throw new NotFoundException('La dirección ya fue entregada');

			const isLima = direccion.id_ubicacion === 1;

			const direccionesFiltro = direccion.direciones.filter(d => d.entregado === 0);

			for (const dd of direccionesFiltro) {
				const pedido = dd.pedido;

				pedido.condicion_envio = isLima ? CONFIRM_MOTORIZADO : EN_AGENCIA_COURIER;
				pedido.condicion_envio_code = isLima ? CONFIRM_MOTORIZADO_INT : EN_AGENCIA_COURIER_INT;

				if (dd.recibido === 1) {
					dd.entregado = 1;
					dd.fecha_entregado = new Date();
				}
			}
			const entregados = direccion.direciones.filter(d => d.entregado === 1);

			if (direccion.direciones.length === entregados.length) {
				direccion.entregado = 2;
				direccion.importe = dto.importe.toString();
				direccion.forma_pago = dto.forma_pago;
				direccion.estado_dir = isLima ? CONFIRM_MOTORIZADO : EN_AGENCIA_COURIER;
				direccion.estado_dir_code = isLima ? CONFIRM_MOTORIZADO_INT : EN_AGENCIA_COURIER_INT;
			} else {
				direccion.entregado = 1;
				direccion.importe = dto.importe.toString();
				direccion.forma_pago = dto.forma_pago;
				direccion.estado_dir = PRE_ENTREGADO_PARCIAL;
				direccion.estado_dir_code = PRE_ENTREGADO_PARCIAL_INT;
			}

			return this.direccionRespository.save(direccion);
		} catch (error) {
			console.log(error);
			throw new NotFoundException('Error al Entregar');
		}
	}

	async createReprogramar(id: string, idUser: number, motivo: string) {
		try {
			if (!idUser) throw new NotFoundException('Debe tener el id del usuario');
			if (!motivo) throw new NotFoundException('Debe tener un motivo');
			const direccion = await this.direccionRespository.findOne({
				relations: ['direciones', 'direciones.pedido', 'reprogramaciones'],
				where: { id: parseInt(id, 10), direciones: { eliminado: 0 } },
			});
			if (!direccion) throw new NotFoundException('No se encontro la direccion');
			if (direccion.id_motorizado !== idUser)
				throw new NotFoundException('No puede reprogramar el pedido');

			const detalles = direccion.direciones;

			detalles.forEach(detalle => {
				const pedido = detalle.pedido;
				pedido.condicion_envio = ENVIO_REPROGRAMADO;
				pedido.condicion_envio_code = ENVIO_REPROGRAMADO_INT;
			});

			direccion.estado_dir = ENVIO_REPROGRAMADO;
			direccion.estado_dir_code = ENVIO_REPROGRAMADO_INT;

			await this.direccionRespository.save(direccion);

			const lastIdImagen =
				parseInt(
					(
						await this.enviosReprogramacionRespository.query(
							`SELECT MAX(id) as id FROM envios_reprogramaciones`,
						)
					)[0].id,
				) + 1;

			const reprogramacion = new EnviosReprogramaciones();
			reprogramacion.direccion = direccion;
			reprogramacion.motivo = motivo;
			reprogramacion.user_id = idUser;
			reprogramacion.created_at = new Date();
			reprogramacion.id = lastIdImagen;
			return this.enviosReprogramacionRespository.save(reprogramacion);
		} catch (error) {
			throw new NotFoundException(error);
		}
	}

	async createRechazar(id: string, idUser: number, motivo: string) {
		try {
			if (!idUser) throw new NotFoundException('Debe tener el id del usuario');
			if (!motivo) throw new NotFoundException('Debe tener un motivo');
			const direccion = await this.direccionRespository.findOne({
				relations: ['direciones', 'direciones.pedido', 'reprogramaciones', 'noEntregados'],
				where: { id: parseInt(id, 10), direciones: { eliminado: 0 } },
			});
			if (!direccion) throw new NotFoundException('No se encontro la direccion');
			if (direccion.id_motorizado !== idUser)
				throw new NotFoundException('No puede reprogramar el pedido');
			if (direccion.noEntregados.length > 0)
				throw new NotFoundException('El pedido ya fue marcado como No entregado');

			const detalles = direccion.direciones;

			detalles.forEach(detalle => {
				const pedido = detalle.pedido;
				pedido.condicion_envio = ENVIO_NO_ENTREGADO;
				pedido.condicion_envio_code = ENVIO_NO_ENTREGADO_INT;
			});

			direccion.estado_dir = ENVIO_NO_ENTREGADO;
			direccion.estado_dir_code = ENVIO_NO_ENTREGADO_INT;

			await this.direccionRespository.save(direccion);

			const lastID =
				parseInt(
					(
						await this.enviosRechazadosRespository.query(
							`SELECT MAX(id) as id FROM envios_no_entregado`,
						)
					)[0].id,
				) + 1;
			const rechazado = new EnviosRechazados();
			rechazado.direccion = direccion;
			rechazado.motivo = motivo;
			rechazado.user_id = idUser;
			rechazado.id = lastID;
			rechazado.created_at = new Date();
			return this.enviosRechazadosRespository.save(rechazado);
		} catch (error) {
			throw new NotFoundException(error);
		}
	}
}
