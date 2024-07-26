import { ApiProperty } from '@nestjs/swagger';
import { IsString, isString } from 'class-validator';
import { Column } from 'typeorm';

export class UserDto {
	@IsString()
	name: string;

	@IsString()
	@ApiProperty()
	email: string;


	@IsString()
	@ApiProperty()
	password:string;
}

export class LoginDto {

	@IsString()
	@ApiProperty()
	email: string;


	@IsString()
	@ApiProperty()
	password:string;
}
