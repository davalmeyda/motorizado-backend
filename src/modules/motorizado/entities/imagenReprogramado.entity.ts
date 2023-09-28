import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'envios_reprog_fotos' })
export class ImagenReprogramado {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	url: string;

	@Column()
	name: string;

	@Column()
	id_reprog: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
