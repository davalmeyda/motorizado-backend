import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'clientes' })
export class Pedido {
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	correlativo: string;

	@Column()
	nombre: string;

	@Column()
	celular: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn() 
	updated_at: Date;
}
