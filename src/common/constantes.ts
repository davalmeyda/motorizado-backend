import { diskStorage } from 'multer';
import { extname, join } from 'path';

export const constantes = {
	pathFile:
		process.env.TIPO === 'PROD'
			? join(__dirname, '..', 'public', 'files') + '/'
			: join(__dirname, '..', '..', 'public', 'files') + '/',
	// pathFile: './dist/public/files/',
	removePath: 'public/',
	getPath:
		process.env.TIPO === 'PROD'
			? join(__dirname, '..', 'public') + '/'
			: join(__dirname, '..', '..', 'public') + '/',
};

export const getStorage = (destination: string, keepOriginalName: boolean = false) => {
	return diskStorage({
		destination: destination,
		filename: (req, file, callback) => {
			if (keepOriginalName) {
				// Mantener el nombre original del archivo
				// callback(null, file.originalname);
				callback(null, file.originalname);
			} else {
				// Generar un nombre único para el archivo
				const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
				const ext = extname(file.originalname);
				callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
			}
		},
	});
};

