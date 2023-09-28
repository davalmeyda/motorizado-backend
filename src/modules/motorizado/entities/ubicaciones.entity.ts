import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'ubicacion' })
export class Ubicacion {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	cod_ubicacion: string;

	@Column()
	nombre_ubicacion: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
