import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	OneToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
} from 'typeorm';
import { DetallePedido } from './detalle_pedido.entity';
import { PedidosAnulacion } from './pedidos_anulacion.entity';
import { AutorizacionBancaDigital } from './autorizacion_banca.entity';
import { User } from './user.entity';
import { OperacionOficina } from './operaciones_oficinas.entity';

@Entity({ name: 'pedidos' })
export class Pedido {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	correccion: number;

	@Column()
	codigo: number;

	@Column({ nullable: true })
	correccion_completada: number | null;

	@Column()
	c_tipo_banca: string;

	@Column()
	condicion_envio_code: number;

	@Column()
	condicion_envio: string;

	@Column()
	c_razon_social: string;

	@Column()
	user_clavepedido: string;

	@Column()
	user_pdf_banca: number;

	@Column()
	fecha_envio_atendido_op: Date;

	@Column()
	condicion_envio_at: Date;

	@Column()
	voucher_subido: number;

	@Column()
	estado: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
	
	@OneToOne(() => DetallePedido)
	@JoinColumn({ name: 'id', referencedColumnName: 'pedido_id' })
	detallePedidos: DetallePedido;

	@OneToMany(() => PedidosAnulacion, anulacion => anulacion.pedido)
	pedidosAnulacions: PedidosAnulacion[];

	@OneToMany(() => AutorizacionBancaDigital, abd => abd.pedido)
	autorizacionBancaDigital: AutorizacionBancaDigital[];

	@OneToOne(() => User)
	@JoinColumn({ name: 'user_clavepedido', referencedColumnName: 'clave_pedidos' })
	user: User;

	// Otras columnas y relaciones...
}
