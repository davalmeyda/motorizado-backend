import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'imagen_bancarizacion' })
export class ImagenBancarizacion {
	@PrimaryGeneratedColumn()
	id: number;
	@Column()
	pedido_id: number;

	@Column()
	user_id: number;

	@Column()
	name: string;

	@Column()
	url: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
