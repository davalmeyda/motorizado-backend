import {
	BadRequestException,
	Body,
	Controller,
	Get,
	NotFoundException,
	Post,
	Query,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PedidoService } from '../services/pedido.service';
import { PedidoDto, UploadImagesDto } from '../dtos/pedido.dto';
import { customResponse } from 'src/common/response';
import { Pedido } from '../entities/pedido.entity';
import { query } from 'express';
import * as fs from 'fs';
import { constantes, getStorage } from 'src/common/constantes';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImagenBancarizacion } from '../entities/imagen_bancarizacion.entity';
import { ImagenBancarizacionService } from '../services/imagenBancarizacion.service';
import { pathFile } from 'src/utils/pathFile';
interface ApiResponse {
	statusCode: number;
	message: string;
	body?: Pedido[]; // Aquí especificas el tipo de cuerpo según tu necesidad
}
@Controller('bancarizacion/pedido')
@ApiTags('Bancarizacion')
export class PedidoController {
	constructor(
		private readonly pedidoService: PedidoService,
		@InjectRepository(Pedido) private readonly pedidoRepository: Repository<Pedido>,
		private readonly imagenBancarizacion: ImagenBancarizacionService,
	) {}

	@Post('imagenes')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(
		FilesInterceptor('images', 200, {
			storage: getStorage(constantes.pathFile + 'bancarizacion/images', true),
		}),
	)
	@ApiBody({
		description: 'Subir imágenes para generar un PDF',
		type: UploadImagesDto,
	})
	@ApiResponse({ status: 201, description: 'Imágenes subidas correctamente.' })
	async uploadFiles(
		@UploadedFiles() files: Express.Multer.File[],
		@Body('PedidoId') PedidoId: number,
		@Body('userId') userId: number,
	) {
		// const {pedidoId } = idUser; // Capturar pedidoId del cuerpo de la solicitud
		// if (!pedidoId) {
		//   throw new BadRequestException('PedidoId es requerido');
		// }

		try {
			if (!PedidoId) {
				throw new BadRequestException('PedidoId es requerido en la consulta.');
			}

			console.log('Pedido id controlador: ' + PedidoId);
			let ruta_url= '';
			console.log(files);
			const result = await this.pedidoService.createPdf(files, PedidoId);
			//   console.log("resultado: "+result.statusCode );
			if (result.statusCode === 201) {
				await this.pedidoRepository.update(
					{ id: PedidoId },
					{
						condicion_envio: 'ENTREGADO SIN SOBRE - CLIENTE',
						condicion_envio_code: 14,
						fecha_envio_atendido_op: new Date(),
						condicion_envio_at: new Date(),
						voucher_subido: 1,
					},
				);

				const fullPath = result.filepath.split("public/");
				// console.log("ruta: "+fullPath);
				// const parts = fullPath.split('\\'); // Divide la cadena por el separador de directorios de Windows
				// const relevantPartIndex = parts.indexOf('public');
				// const url_imagen = parts.slice(relevantPartIndex + 1).join('/')+'/'+result.filename; 
				//--- CREAR PDF EN LA TABLA IMAGEN
				await this.imagenBancarizacion.create(PedidoId, userId, result.filename, fullPath[1]+"/"+result.filename);
				ruta_url = fullPath[1]+"/"+result.filename;
			}

			return {
				statusCode: result.statusCode,
				message: result.message,
				ruta_archivo: ruta_url ,
				body: result.pdfPaths, // Ajusta según lo que devuelva exactamente createPdf
			};
		} catch (error) {
			console.error('Error al subir imágenes y generar PDF:', error);
			throw new BadRequestException('Error al subir imágenes y generar PDF.', error);
		}
	}

	@Get('listar_banca')
	@ApiOperation({ summary: 'Listar todos los pedidos de bancarizacion' })
	async getPedidos(): Promise<ApiResponse> {
		// Asegúrate de definir el tipo de retorno como Promise<Pedido[]>
		try {
			const pedidos = await this.pedidoService.getPedidos();
			return {
				statusCode: 200,
				message: 'Pedidos encontrados exitosamente',
				body: pedidos,
			};
		} catch (error) {
			console.error('Error al obtener pedidos:', error);
			throw error;
		}
	}
}
