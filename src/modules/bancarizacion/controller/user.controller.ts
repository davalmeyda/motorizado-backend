import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';

import { customResponse } from 'src/common/response';
import { LoginDto } from '../dtos/user.dto';

@Controller('bancarizacion/user')
@ApiTags('User')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('login')
	@ApiOperation({
		summary: 'Login de la aplicación',
	})
	async login(@Body() loginDto: LoginDto) {
		const response = await this.userService.login(loginDto);
		return customResponse('login', response);
	}
}
