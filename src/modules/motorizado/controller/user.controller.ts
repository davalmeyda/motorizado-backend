import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { LoginDto, UserDto } from '../dtos/user.dto';
import { customResponse } from 'src/common/response';
import { boolean } from 'joi';

@Controller('users')
@ApiTags('Usuario')
export class UserController {
	constructor(private readonly UserService: UserService) { }

	@Get()
	@ApiOperation({ summary: 'Listar todos los usuarios' })
	async findAll() {
		const response = await this.UserService.findAll();
		return customResponse('Usuario', response);
	}

	// // @Get(':id')
	// // @ApiOperation({ summary: 'Buscar usuario por id' })
	// // async findOne(@Param('id') id: number) {
	// // 	return this.UserService.findOne(id);
	// // }

	@Post()
	@ApiOperation({ summary: 'Crear usuario' })
	async create(@Body() user: UserDto) {
		return this.UserService.create(user);
	}

	// @Post('login')
	// @ApiOperation({ summary: 'Login usuario' })
	// LoginUser(@Body()UserDto: LoginDto){
	// 	return this.UserService.login(UserDto);
	// }

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar usuario' })
	async delete(@Param('id') id: number) {
		return this.UserService.delete(id);
	}

	//-- LOGIN 
	@Post('login')
	@ApiOperation({ summary: 'Login usuario' })
	async LoginUser(@Body() UserDto: LoginDto) {
		// Aquí deberías realizar la lógica de autenticación
		// Verifica las credenciales y determina si el inicio de sesión es exitoso

		const authUser = this.UserService.login(UserDto);

	
		if (await authUser != 0) {
			// Si el inicio de sesión es exitoso, devuelve un JSON de respuesta
			
			const statusCode = HttpStatus.ACCEPTED;
			return {
				message: 'Inicio de sesión exitoso',
				statusCode,
			}
		} else {
			throw new HttpException('Credenciales incorrectas', HttpStatus.UNAUTHORIZED);

		}
	}


}
