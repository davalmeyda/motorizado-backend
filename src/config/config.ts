import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('config', () => ({
	port: process.env.PORT,
	tipo: process.env.TIPO,
	host: process.env.HOST,
	port_db: process.env.PORT_DB,
	user_name: process.env.USER_NAME,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
}));

export const validation = {
	PORT: Joi.number().required(),
	TIPO: Joi.string().required(),
	HOST: Joi.string().required(),
	PORT_DB: Joi.number().required(),
	USER_NAME: Joi.string().required(),
	PASSWORD: Joi.string().required(),
	DATABASE: Joi.string().required(),
};
