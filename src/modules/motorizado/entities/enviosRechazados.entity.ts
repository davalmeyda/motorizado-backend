import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Direccion } from './direcciones.entity';

@Entity({ name: 'envios_no_entregado' })
export class EnviosRechazados {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	motivo: string;

	@Column()
	user_id: number;

	@ManyToOne(() => Direccion, model => model.direciones)
	@JoinColumn({ name: 'id_direccion' })
	direccion: Direccion;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
