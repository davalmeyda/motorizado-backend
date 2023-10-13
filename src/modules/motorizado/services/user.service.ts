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
		try {
			return this.UserRespository.find();
		} catch (error) {
			throw new NotFoundException(error);
		}
	}

	findOne(id: number) {
		try {
			return this.UserRespository.findOne({
				where: { id },
			});
		} catch (error) {
			throw new NotFoundException(error);
		}
	}

	create(user: UserDto) {
		try {
			const newUser = new User();
			newUser.email = user.email;
			newUser.password = user.password;
			newUser.created_at = new Date();
			newUser.updated_at = new Date();

			return this.UserRespository.save(newUser);
		} catch (error) {
			throw new NotFoundException(error);
		}
	}

	async login(userLogin: LoginDto) {
		try {
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
		} catch (error) {
			throw new NotFoundException(error);
		}
	}

	delete(id: number) {
		try {
			return this.UserRespository.delete(id);
		} catch (error) {
			throw new NotFoundException(error);
		}
	}
}
