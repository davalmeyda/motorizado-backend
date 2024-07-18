import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';


import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { LoginDto } from '../dtos/user.dto';

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

	async login(userLogin: LoginDto): Promise<User> {
		const { password, email } = userLogin;

		const user = await this.userRepository.findOne({
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
				if (user.rol === 'Bancarización') {
					return user;
				}
				throw new ForbiddenException('No tiene permisos para acceder');
			} else {
				throw new BadRequestException('No se encontro el usuario');
			}
		} else {
			throw new BadRequestException('No se encontro el usuario');
		}
	}
}
