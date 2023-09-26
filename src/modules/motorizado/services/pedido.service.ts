import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from '../entities/pedido.entity';
import { Repository } from 'typeorm';
// import { PedidoDto } from '../dtos/pedido.dto';

@Injectable()
export class PedidoService {
	constructor(@InjectRepository(Pedido) private readonly PedidoRespository: Repository<Pedido>) {}

	findAll() {
		return this.PedidoRespository.find();
	}

	findOne(cod: string) {
		return this.PedidoRespository.findOne({
			relations:['direccionDt', 'direccionDt.direccion'],
			where: { codigo: cod },
		});
	}
	
}
