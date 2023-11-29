import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { DireccionDT } from './direccionesdt.entity';

@Entity({ name: 'pedidos' })
export class Pedido {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	correlativo: string;

	@Column()
	condicion_envio: string;

	@Column()
	condicion_envio_code: number;

	@Column()
	codigo: string;

	@Column()
	c_razonsocial: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@OneToMany(() => DireccionDT, direccion => direccion.pedido)
	direccionDt: DireccionDT[];
}
