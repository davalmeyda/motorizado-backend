import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PedidoDto {

	@IsString()
	@ApiProperty()
	correlativo: string;

	@IsString()
	@ApiProperty()
	celular_cliente: string;

	@IsString()
	@ApiProperty()
	codigo: string;

	@IsString()
	@ApiProperty()
	c_razonsocial: string;


	@IsString()
	@ApiProperty()
	ca_cantidad: string;

}
