import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'envios_no_entregado_fotos' })
export class ImagenRechazado {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	url: string;

	@Column()
	name: string;

	@Column()
	id_no_entregado: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
