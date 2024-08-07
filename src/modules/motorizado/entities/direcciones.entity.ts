import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DireccionDT } from './direccionesdt.entity';
import { EnviosReprogramaciones } from './enviosReprogramaciones.entity';
import { EnviosRechazados } from './enviosRechazados.entity';

@Entity({ name: 'direcciones_sobres' })
export class Direccion {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	correlativo: string;

	@Column()
	id_agencia: number;

	@Column()
	id_cliente: number;

	@Column()
	id_ubicacion: number;

	@Column()
	id_motorizado: number;

	@Column()
	dni_ruc: string;

	@Column()
	nombre_contacto: string;

	@Column()
	celulares: string;

	@Column()
	direccion: string;

	@Column()
	departamento: string;

	@Column()
	provincia: string;

	@Column()
	distrito: string;

	@Column()
	referencia: string;

	@Column()
	observaciones: string;

	@Column()
	google_maps: string;

	@Column()
	empresa_transporte: string;

	@Column()
	estado: number;

	@Column()
	importe: string;

	@Column()
	forma_pago: string;

	@Column()
	recibido: number;

	@Column()
	entregado: number;

	@Column()
	confirmado: number;

	@Column()
	estado_dir: string;

	@Column()
	fecha_asig_motorizado: Date;

	@Column()
	estado_dir_code: number;

	@OneToMany(() => DireccionDT, direccionDt => direccionDt.direccion)
	direciones: DireccionDT[];

	@OneToMany(() => EnviosReprogramaciones, model => model.direccion)
	reprogramaciones: EnviosReprogramaciones[];

	@OneToMany(() => EnviosRechazados, model => model.direccion)
	noEntregados: EnviosRechazados[];
}
