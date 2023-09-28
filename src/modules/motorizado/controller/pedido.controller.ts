import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PedidoService } from '../services/pedido.service';
// import { PedidoDto } from '../dtos/pedido.dto';
import { customResponse } from 'src/common/response';
import { CodigosDto, ImagenEnvioDto } from '../dtos/pedido.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { pathFile } from 'src/utils/pathFile';
import { constantes } from 'src/common/constantes';
import { ImagenEnviosService } from '../services/imagenEnvios.service';
import { ImagenReprogramadoService } from '../services/imagenReprogramados.service';

@Controller('pedido')
@ApiTags('Pedido')
export class PedidoController {
	constructor(
		private readonly pedidoService: PedidoService,
		private readonly imagenEnviosService: ImagenEnviosService,
		private readonly imagenReprogramadosService: ImagenReprogramadoService,
	) {}

	@Get()
	@ApiOperation({ summary: 'Listar todos los pedidos' })
	async findAll(@Query('search') search: string) {
		const response = await this.pedidoService.findAll(search);
		return customResponse('pedidos', response);
	}

	@Get('/pendientes')
	@ApiOperation({ summary: 'Listar todos los pedidos pendientes' })
	async findAllPendientes(@Query('search') search: string, @Query('idUser') idUser: number) {
		const response = await this.pedidoService.findAllPendientes(search, idUser);
		return customResponse('pedidos', response);
	}

	@Get('/recibidos')
	@ApiOperation({ summary: 'Listar todos los pedidos recibidos' })
	async findAllRecibidos(@Query('idUser') idUser: number, @Query('search') search?: string) {
		const response = await this.pedidoService.findAllRecibidos(search, idUser);
		return customResponse('pedidos', response);
	}

	@Get('/consultaCodigo/:codigo')
	@ApiOperation({ summary: 'Listar todos los pedidos recibidos' })
	async consultaCodigo(@Param('codigo') codigo: string) {
		return await this.pedidoService.consultaCodigo(codigo);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Buscar pedido por id' })
	async findOne(@Param('id') cod: string) {
		const response = await this.pedidoService.findOne(cod);
		return customResponse('pedidos', response);
	}

	@Post('recibir')
	@ApiOperation({ summary: 'Cambiar estado de recibido a los pedidos' })
	async changeStatus(@Body() codigosDto: CodigosDto) {
		const response = await this.pedidoService.changeStatus(codigosDto);
		return customResponse('pedidos', response);
	}

	@Put('entregar/:codigo')
	@ApiOperation({ summary: 'Cambiar estado de entregado al pedido' })
	async changeStatusEntregado(
		@Param('codigo') codigo: string,
		@Query('idUser') idUser: number,
		@Query('importe') importe: string,
	) {
		const response = await this.pedidoService.changeStatusEntregado(codigo, idUser, importe);
		return customResponse('pedidos', response);
	}

	@Put('/imagenDespacho/:codigo/')
	@ApiOperation({ summary: 'Subir archivos de envio' })
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(
		FileInterceptor('imagen', {
			dest: constantes.pathFile + 'envio',
		}),
	)
	@ApiBody({ type: ImagenEnvioDto })
	async uploadArchivos(
		@Param('codigo') codigo: string,
		@Query('user_id') user_id: string,
		@UploadedFile() file: Express.Multer.File,
	) {
		if (file) {
			const pedido = await this.pedidoService.findOne(codigo);
			if (pedido) {
				if (!user_id) throw new NotFoundException('Debe tener el id del usuario');
				if (pedido.pedido.direccionDt.direccion.id_motorizado !== parseInt(user_id, 10))
					throw new NotFoundException('No se encontraron coincidencias para el usuario');
				let pathImg = '';
				pathImg = pathFile(file);
				await this.imagenEnviosService.create(pedido.pedido, pathImg, parseInt(user_id, 10));
				let response = {};
				const resImg = pathImg !== '' ? { url_imagen: pathImg } : {};
				response = Object.assign(resImg);

				return customResponse('Imagen subida', response);
			}
			throw new NotFoundException('No se encontraron coincidencias');
		} else {
			throw new NotFoundException('Se necesita al menos un archivo');
		}
	}

	@Put('reprogramar/:codigo')
	@ApiOperation({
		summary: 'Cambiar estado de reprogramado al pedido y registrar una reprogramacion',
	})
	async createReprogramar(
		@Param('codigo') codigo: string,
		@Query('idUser') idUser: string,
		@Query('motivo') motivo: string,
	) {
		const response = await this.pedidoService.createReprogramar(
			codigo,
			parseInt(idUser, 10),
			motivo,
		);
		return customResponse('pedidos', response);
	}

	@Put('/imagenReprogramacion/:codigo/')
	@ApiOperation({ summary: 'Subir archivos de reprogramacion' })
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(
		FileInterceptor('imagen', {
			dest: constantes.pathFile + 'reprogramado',
		}),
	)
	@ApiBody({ type: ImagenEnvioDto })
	async uploadArchivosReprogramados(
		@Param('codigo') codigo: string,
		@Query('user_id') user_id: string,
		@Query('reprogramacion_id') reprogramacion_id: string,
		@UploadedFile() file: Express.Multer.File,
	) {
		if (file) {
			const pedido = await this.pedidoService.findOne(codigo);
			if (pedido) {
				if (!reprogramacion_id)
					throw new NotFoundException('Debe tener el id de la reprogramacion');
				if (!user_id) throw new NotFoundException('Debe tener el id del usuario');
				if (pedido.pedido.direccionDt.direccion.id_motorizado !== parseInt(user_id, 10))
					throw new NotFoundException('No se encontraron coincidencias para el usuario');
				let pathImg = '';
				pathImg = pathFile(file);
				await this.imagenReprogramadosService.create(
					parseInt(reprogramacion_id, 10),
					pathImg,
					file.filename,
				);
				let response = {};
				const resImg = pathImg !== '' ? { url_imagen: pathImg } : {};
				response = Object.assign(resImg);

				return customResponse('Imagen subida', response);
			}
			throw new NotFoundException('No se encontraron coincidencias');
		} else {
			throw new NotFoundException('Se necesita al menos un archivo');
		}
	}
}
