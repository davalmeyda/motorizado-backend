import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto, UserDto } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private readonly UserRespository: Repository<User>) { }

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

	async  login(userLogin: LoginDto) {

		const { password, email } = userLogin;
		//-- HASH PASSWORD
		const saltRounds = 10; // Número de rondas de sal (mayor es más seguro pero más lento)
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		//return hashedPassword;
		const user = await this.UserRespository.findOne({
			where: {
				email
			},
			select: { email: true, password: true ,id: true}
		});
		//return user.password;

		if(user){
		
			const hashPass = /^\$2y\$/.test(user.password) ? '$2b$' + user.password.slice(4) : user.password;
			const match = await bcrypt.compare(password, hashPass);

			if (match) { /* USUARIO Y CONTRASEÑA COINCIDEN*/ 
				return 1;
			}else{
				return 0;
			}

		} else {
			return 0;
		}
	}

	delete(id: number) {
		return this.UserRespository.delete(id);
	}
}
