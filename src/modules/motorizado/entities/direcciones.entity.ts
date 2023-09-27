import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { DireccionDT } from './direccionesdt.entity';

@Entity({ name: 'direcciones_sobres' })
export class Direccion {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	correlativo: string;

	@Column()
	direccion: string;

	@Column()
	id_cliente: number;

	@Column()
	recibido: string;

	@OneToMany(() => DireccionDT, direccionDt => direccionDt.direccion)
	direciones: DireccionDT[];
}
