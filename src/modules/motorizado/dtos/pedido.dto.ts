import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

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

	@IsOptional()
	@IsNumber()
	@ApiProperty()
	idUser: number;
}
export class ImagenEnvioDto {
	@ApiProperty({ type: 'string', format: 'binary', required: false })
	imagen: any;
}

export class PedidoTransaccionDto {
	@IsNumber()
	@ApiProperty()
	direccionId: number;

	@IsNumber()
	@ApiProperty()
	idUser: number;

	@IsOptional()
	@IsNumber()
	@ApiProperty()
	importe: number;

	@IsOptional()
	@IsString()
	@ApiProperty()
	forma_pago: string;
}
