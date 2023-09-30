import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Direccion } from './direcciones.entity';

@Entity({ name: 'direcciones_sobres_detalle' })
export class DireccionDT {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Direccion, direccion => direccion.direciones)
	@JoinColumn({ name: 'id_direccion_sobres' })
	direccion: Direccion;

	@OneToOne(() => Pedido, pedido => pedido.direccionDt)
	@JoinColumn({ name: 'id_pedido' })
	pedido: Pedido;

	@Column()
	codigo: string;

	@Column()
	producto: string;

	@Column()
	cantidad: number;

	@Column()
	recibido: number;

	@Column({ nullable: true })
	fecha_recibido: Date;

	@Column()
	entregado: number;

	@Column({ nullable: true })
	fecha_entregado: Date;

	@Column()
	confirmado: number;

	@Column({ nullable: true })
	fecha_confirmado: Date;
}
