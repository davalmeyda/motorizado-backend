import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Pedido } from './pedido.entity';

@Entity({ name: 'operaciones_oficinas' })
export class OperacionOficina {
	@PrimaryGeneratedColumn()
	id: number;
	@Column()
	oficina: number;

	@Column()
	base: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
