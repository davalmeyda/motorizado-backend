import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DireccionDT } from './direccionesdt.entity';

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
	estado: number;

	@Column()
	recibido: number;

	@Column()
	entregado: number;

	@Column()
	confirmado: number;

	@OneToMany(() => DireccionDT, direccionDt => direccionDt.direccion)
	direciones: DireccionDT[];
}
