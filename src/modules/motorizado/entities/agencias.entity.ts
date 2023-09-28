import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'agencias' })
export class Agencia {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	cod_agencia: string;

	@Column()
	nombre_agencia: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
