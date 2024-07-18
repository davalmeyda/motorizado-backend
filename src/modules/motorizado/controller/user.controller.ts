import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { LoginDto, UserDto } from '../dtos/user.dto';
import { customResponse } from 'src/common/response';

@Controller('users')
@ApiTags('Usuario')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@ApiOperation({ summary: 'Listar todos los usuarios' })
	async findAll() {
		const response = await this.userService.findAll();
		return customResponse('Usuario', response);
	}

	// // @Get(':id')
	// // @ApiOperation({ summary: 'Buscar usuario por id' })
	// // async findOne(@Param('id') id: number) {
	// // 	return this.UserService.findOne(id);
	// // }

	// @Post()
	// @ApiOperation({ summary: 'Crear usuario' })
	// async create(@Body() user: UserDto) {
	// 	return this.userService.create(user);
	// }

	// @Post('login')
	// @ApiOperation({ summary: 'Login usuario' })
	// LoginUser(@Body()UserDto: LoginDto){
	// 	return this.UserService.login(UserDto);
	// }

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar usuario' })
	async delete(@Param('id') id: number) {
		return this.userService.delete(id);
	}

	//-- LOGIN
	@Post('login')
	@ApiOperation({ summary: 'Login usuario' })
	async LoginUser(@Body() UserDto: LoginDto) {
		// Aquí deberías realizar la lógica de autenticación
		// Verifica las credenciales y determina si el inicio de sesión es exitoso

		const authUser = await this.userService.login(UserDto);

		if (authUser) {
			const statusCode = HttpStatus.ACCEPTED;
			return customResponse('Usuario', authUser, statusCode);
		} else {
			throw new HttpException('Credenciales incorrectas', HttpStatus.UNAUTHORIZED);
		}
	}
}
