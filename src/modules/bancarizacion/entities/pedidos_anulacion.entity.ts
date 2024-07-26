import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from './pedido.entity';

@Entity({ name: 'pedidos_anulacions' })
export class PedidosAnulacion {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	state_solicitud: number;

	@Column()
	tipo: string;

	@ManyToOne(() => Pedido, pedido => pedido.pedidosAnulacions)
	@JoinColumn({ name: 'pedido_id' }) // Nombre correcto de la columna en la tabla pedidos_anulacions
	pedido: Pedido;
	// Otras columnas y relaciones...
}
