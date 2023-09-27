import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

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
export class CodigosDto {
	@IsArray()
	@ApiProperty()
	codigos: string[];
}
