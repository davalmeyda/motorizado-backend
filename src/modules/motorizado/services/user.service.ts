import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private readonly UserRespository: Repository<User>) {}

	findAll() {
		return this.UserRespository.find();
	}

	findOne(id: number) {
		return this.UserRespository.findOne({
			where: { id},
		});
	}
	
	create(user: UserDto) {
		const newUser = new User();
		newUser.name = user.name;
		newUser.email = user.email;
		newUser.created_at = new Date();
		newUser.updated_at = new Date();

		return this.UserRespository.save(newUser);
	}

	delete(id: number) {
		return this.UserRespository.delete(id);
	}
}
