import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'direccion_detalle_imagenes' })
export class DireccionDetalleImagenes {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	id_imagen_envio: number;

	@Column()
	id_direccion_detalle: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
