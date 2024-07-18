import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MotorizadoModule } from './modules/motorizado/motorizado.module';
import { BancarizacionModule } from './modules/bancarizacion/bancarizacion.module';

export function generateDocumentacion(app) {
	/** Genera una documentacion para el modulo de Cliente Publicidad */
	const clientePublicidadMod = new DocumentBuilder()
		.setTitle('Motorizado')
		.setDescription('Modulo Motorizado')
		.setVersion(process.env.APP_VERSION)
		// .addTag('Motorizado')
		.build();
	const motorizadoDocument = SwaggerModule.createDocument(app, clientePublicidadMod, {
		include: [MotorizadoModule],
	});
	SwaggerModule.setup('docs/motorizado', app, motorizadoDocument);

	/** Genera una documentacion para el modulo de Bancarizacion */
	const bancarizadoMod = new DocumentBuilder()
		.setTitle('Bancarizacion')
		.setDescription('Modulo de Bancarizacion')
		.setVersion(process.env.APP_VERSION)
		// .addTag('Motorizado')
		.build();
	const bancarizacionDocument = SwaggerModule.createDocument(app, bancarizadoMod, {
		include: [BancarizacionModule],
	});
	SwaggerModule.setup('docs/bancarizacion', app, bancarizacionDocument);
}
