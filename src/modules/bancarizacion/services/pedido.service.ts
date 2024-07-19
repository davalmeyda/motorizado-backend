import { Injectable, HttpStatus, HttpException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository, SelectQueryBuilder } from 'typeorm';
import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import { Pedido } from '../entities/pedido.entity';
import { constantes } from 'src/common/constantes';

@Injectable()
export class PedidoService {
	constructor(
		@InjectRepository(Pedido) private readonly pedidoRepository: Repository<Pedido>,
	
	) {}

	async createPdf(
		files: Express.Multer.File[],
		pedidoId: number,
	): Promise<{ message: string; pdfPaths: string[]; statusCode: number,filename : string ,filepath : string}> {
		try {
			const uploadsDir = constantes.pathFile + 'bancarizacion';

			// Verificar y crear la carpeta 'uploads' si no existe
			if (!fs.existsSync(uploadsDir)) {
				fs.mkdirSync(uploadsDir, { recursive: true });
			}

			const pdfDoc = await PDFDocument.create();

			for (const file of files) {
				// Leer la imagen desde el archivo temporal subido
				const imageBytes = fs.readFileSync(file.path);
				const image = await pdfDoc.embedJpg(imageBytes);

				// Tamaño de una página A4 en puntos
				const pageWidth = 595;
				const pageHeight = 842;

				// Calcular el tamaño de la imagen
				const imageHeight = pageHeight / 2; // La mitad de la altura de la página A4
				const imageWidth = (image.width / image.height) * imageHeight; // Mantener la relación de aspecto

				// Calcular la posición de la imagen para centrarla
				const x = (pageWidth - imageWidth) / 2;
				const y = (pageHeight - imageHeight) / 2;

				const page = pdfDoc.addPage([pageWidth, pageHeight]);
				page.drawImage(image, {
					x: x,
					y: y,
					width: imageWidth,
					height: imageHeight,
				});
			}

			// Generar el nombre del archivo PDF basado en el nombre original del primer archivo de imagen
			// console.log(path.parse(files[0].originalname));
			const originalFileName = path.parse(files[0].originalname).name;
			const pdfFileName = `${originalFileName}.pdf`;
			const pdfPath = path.join(uploadsDir, pdfFileName);

			// Guardar el documento PDF generado
			const pdfBytes = await pdfDoc.save();
			fs.writeFileSync(pdfPath, pdfBytes);

			return {
				message: 'PDF creado con éxito.',
				filename: pdfFileName,
				filepath: uploadsDir,
				pdfPaths: [pdfPath], // Un solo archivo PDF
				statusCode: HttpStatus.CREATED, // Código de estado HTTP 201 para creación exitosa
			};
		} catch (error) {
			throw new BadRequestException('Error al crear el PDF Service: ',error);
		}
	}
	async getPedidos(): Promise<Pedido[]> {
		try {
			const pedidos = await this.pedidoRepository
				.createQueryBuilder('pedidos')
				.leftJoinAndSelect('pedidos.user', 'u')
				.leftJoinAndSelect('pedidos.detallePedidos', 'dp')
				.leftJoin('pedidos.pedidosAnulacions', 'pedidos_anulacions')
				.leftJoin('pedidos.autorizacionBancaDigital', 'abd')
				.leftJoin('abd.autorizacionBancaDigitalImagenes', 'abdi')
				.where(
					"(pedidos_anulacions.id IS NULL OR pedidos_anulacions.state_solicitud = 0 OR pedidos_anulacions.tipo = 'F' OR pedidos_anulacions.tipo = 'Q')",
				)
				.andWhere('u.estado = :estado', { estado: '1' })
				.andWhere('pedidos.correccion IN (:...correcciones)', { correcciones: [0, 1, 3] })
				.andWhere('pedidos.correccion_completada IN (:...correcciones_completada)', {
					correcciones_completada: [0, 1, null],
				})
				.andWhere('pedidos.c_tipo_banca IN (:...tipos_banca)', {
					tipos_banca: ['ELECTRONICA - banca digital'],
				})
				.andWhere('pedidos.estado = :estado_pedido', { estado_pedido: '1' })
				.andWhere('dp.estado = :estado_dp', { estado_dp: '1' })
				.andWhere('pedidos.condicion_envio_code = :condicion_envio_code', {
					condicion_envio_code: 40,
				})
				.andWhere('abdi.id IS NULL')
				.select(['pedidos.id', 'pedidos.codigo', 'dp.nombre_empresa', 'pedidos.c_tipo_banca'])
				.getMany();

			return pedidos;
		} catch (error) {
			console.error('Error en PedidoService al obtener pedidos:', error);
			throw error;
		}
	}
}
