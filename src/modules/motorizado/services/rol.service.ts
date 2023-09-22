import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from '../entities/rol.entity';
import { Repository } from 'typeorm';
import { RolDto } from '../dtos/rol.dto';

@Injectable()
export class RolService {
	constructor(@InjectRepository(Rol) private readonly rolRespository: Repository<Rol>) {}

	findAll() {
		return this.rolRespository.find();
	}

	findOne(idRol: number) {
		return this.rolRespository.findOne({
			where: { id: idRol },
		});
	}

	create(rol: RolDto) {
		const newRol = new Rol();
		newRol.name = rol.name;
		newRol.guard_name = rol.guard_name;
		newRol.created_at = new Date();
		newRol.updated_at = new Date();

		return this.rolRespository.save(newRol);
	}

	delete(idRol: number) {
		return this.rolRespository.delete(idRol);
	}
}
