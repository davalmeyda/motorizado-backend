import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto, UserDto } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';

const ROLES_PERMITIDOS = ['MOTORIZADO'];
@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private readonly UserRespository: Repository<User>) {}

	findAll() {
		return this.UserRespository.find();
	}

	findOne(id: number) {
		return this.UserRespository.findOne({
			where: { id },
		});
	}

	create(user: UserDto) {
		const newUser = new User();
		newUser.email = user.email;
		newUser.password = user.password;
		newUser.created_at = new Date();
		newUser.updated_at = new Date();

		return this.UserRespository.save(newUser);
	}

	async login(userLogin: LoginDto) {
		const { password, email } = userLogin;

		const user = await this.UserRespository.findOne({
			where: {
				email,
			},
		});
		if (user) {
			const hashPass = /^\$2y\$/.test(user.password)
				? '$2b$' + user.password.slice(4)
				: user.password;
			const match = await bcrypt.compare(password, hashPass);

			if (match) {
				if (ROLES_PERMITIDOS.includes(user.rol)) {
					return user;
				}
				throw new NotFoundException('No tiene permisos para acceder');
			} else {
				throw new NotFoundException('No se encontro el usuario');
			}
		} else {
			throw new NotFoundException('No se encontro el usuario');
		}
	}

	delete(id: number) {
		return this.UserRespository.delete(id);
	}
}
