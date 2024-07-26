import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

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
	c_tipo_banca: string;

	@IsString()
	@ApiProperty()
	c_cantidad: string;
}

export class UploadImagesDto {
	@ApiProperty({
		type: 'array',
		items: {
			type: 'string',
			format: 'binary',
		},
	})
	images: any[];
	
}
