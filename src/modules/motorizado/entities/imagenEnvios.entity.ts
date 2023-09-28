import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'imagen_envios' })
export class ImagenEnvio {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	url_imagen: string;

	@Column()
	user_id: number;

	@Column()
	direccion_id: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
