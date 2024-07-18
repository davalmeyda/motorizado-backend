import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config/config';

@Global()
@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: (configService: ConfigType<typeof config>) => {
				return {
					type: 'mariadb',
					host: configService.host,
					port: parseInt(configService.port_db),
					username: configService.user_name,
					password: configService.password === 'null' ? '' : configService.password,
					database: configService.database,
					autoLoadEntities: true,
					synchronize: false,
				};
			},
			inject: [config.KEY],
		}),
	],
	exports: [TypeOrmModule],
})
export class DatabaseModule {}
