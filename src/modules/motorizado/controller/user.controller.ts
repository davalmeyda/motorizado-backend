import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { UserDto } from '../dtos/user.dto';
import { customResponse } from 'src/common/response';

@Controller('users')
@ApiTags('Usuario')
export class UserController {
	constructor(private readonly UserService: UserService) {}

	@Get()
	@ApiOperation({ summary: 'Listar todos los usuarios' })
	async findAll() {
		const response = await this.UserService.findAll();
		return customResponse('Usuario', response);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Buscar usuario por id' })
	async findOne(@Param('id') id: number) {
		return this.UserService.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: 'Crear usuario' })
	async create(@Body() user: UserDto) {
		return this.UserService.create(user);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar usuario' })
	async delete(@Param('id') id: number) {
		return this.UserService.delete(id);
	}
}
