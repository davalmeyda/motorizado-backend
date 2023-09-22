import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RolDto {
	@IsString()
	@ApiProperty()
	name: string;

	@IsString()
	@ApiProperty()
	guard_name: string;
}
