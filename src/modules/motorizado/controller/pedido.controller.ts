import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PedidoService } from '../services/pedido.service';
// import { PedidoDto } from '../dtos/pedido.dto';
import { customResponse } from 'src/common/response';
import { CodigosDto } from '../dtos/pedido.dto';

@Controller('pedido')
@ApiTags('Pedido')
export class PedidoController {
	constructor(private readonly pedidoService: PedidoService) {}

	@Get()
	@ApiOperation({ summary: 'Listar todos los pedidos' })
	async findAll(@Query('search') search: string) {
		const response = await this.pedidoService.findAll(search);
		return customResponse('pedidos', response);
	}

	@Get('/pendientes')
	@ApiOperation({ summary: 'Listar todos los pedidos pendientes' })
	async findAllPendientes(@Query('search') search: string) {
		const response = await this.pedidoService.findAllPendientes(search);
		return customResponse('pedidos', response);
	}

	@Get('/recibidos')
	@ApiOperation({ summary: 'Listar todos los pedidos recibidos' })
	async findAllRecibidos(@Query('search') search: string) {
		const response = await this.pedidoService.findAllRecibidos(search);
		return customResponse('pedidos', response);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Buscar pedido por id' })
	async findOne(@Param('id') cod: string) {
		return this.pedidoService.findOne(cod);
	}

	@Post('recibir')
	@ApiOperation({ summary: 'Cambiar estado de recibido a los pedidos' })
	async changeStatus(@Body() codigosDto: CodigosDto) {
		const response = await this.pedidoService.changeStatus(codigosDto);
		return customResponse('pedidos', response);
	}

	// @Delete(':id')
	// @ApiOperation({ summary: 'Eliminar pedido' })
	// async delete(@Param('id') idRol: number) {
	// 	return this.rolService.delete(idRol);
	// }
}
