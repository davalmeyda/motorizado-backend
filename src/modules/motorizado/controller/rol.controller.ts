import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolService } from '../services/rol.service';
import { RolDto } from '../dtos/rol.dto';
import { customResponse } from 'src/common/response';

@Controller('rol')
@ApiTags('Rol')
export class RolController {
	constructor(private readonly rolService: RolService) {}

	@Get()
	@ApiOperation({ summary: 'Listar todos los roles' })
	async findAll() {
		const response = await this.rolService.findAll();
		return customResponse('roles', response);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Buscar rol por id' })
	async findOne(@Param('id') idRol: number) {
		return this.rolService.findOne(idRol);
	}

	// @Post()
	// @ApiOperation({ summary: 'Crear rol' })
	// async create(@Body() rol: RolDto) {
	// 	return this.rolService.create(rol);
	// }

	@Delete(':id')
	@ApiOperation({ summary: 'Eliminar rol' })
	async delete(@Param('id') idRol: number) {
		return this.rolService.delete(idRol);
	}
}
