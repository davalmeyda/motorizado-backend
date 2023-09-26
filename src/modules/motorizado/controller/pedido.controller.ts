import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PedidoService } from '../services/pedido.service';
// import { PedidoDto } from '../dtos/pedido.dto';
import { customResponse } from 'src/common/response';

@Controller('pedido')
@ApiTags('Pedido')
export class PedidoController {
	constructor(private readonly PedidoService: PedidoService) {}

	@Get()
	@ApiOperation({ summary: 'Listar todos los pedidos' })
	async findAll() {
		const response = await this.PedidoService.findAll();
		return customResponse('pedidos', response);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Buscar pedido por id' })
	async findOne(@Param('id') cod: string) {
		return this.PedidoService.findOne(cod);
	}

	// @Delete(':id')
	// @ApiOperation({ summary: 'Eliminar pedido' })
	// async delete(@Param('id') idRol: number) {
	// 	return this.rolService.delete(idRol);
	// }
}
