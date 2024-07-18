import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Pedido } from './pedido.entity';

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column()
	rol: string;

	@Column()
	clave_pedidos: string;

	@Column()
	estado: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

    @OneToOne(() => Pedido, pedido => pedido.user)
    pedido: Pedido;
}
