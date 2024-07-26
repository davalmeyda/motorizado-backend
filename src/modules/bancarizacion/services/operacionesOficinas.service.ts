import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperacionOficina } from '../entities/operaciones_oficinas.entity';

@Injectable()
export class OperacionOficinaService {
	constructor(
		@InjectRepository(OperacionOficina)
		private readonly OperacionOficinaRepository: Repository<OperacionOficina>,
	) {}

	findAll(OficinaUser: number) {
		try {
			return this.OperacionOficinaRepository.find({
				where: { oficina: OficinaUser },
			});
		} catch (error) {
			throw new NotFoundException(error);
		}
	}
}
