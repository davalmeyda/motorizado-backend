import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { MotorizadoModule } from './modules/motorizado/motorizado.module';
import { ConfigModule } from '@nestjs/config';
import config, { validation } from './config/config';
import * as Joi from 'joi';

@Module({
	imports: [
		ConfigModule.forRoot({
			// * Definimos que es global
			isGlobal: true,
			// * Definimos el archivo de configuracion
			envFilePath: '.env',
			// * Definimos el esquema y la validacion
			load: [config],
			validationSchema: Joi.object(validation),
		}),
		DatabaseModule,
		MotorizadoModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
