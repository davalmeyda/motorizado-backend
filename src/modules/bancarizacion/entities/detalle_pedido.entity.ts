import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Pedido } from './pedido.entity';

@Entity({ name: 'detalle_pedidos' })
export class DetallePedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  estado: number;

  @Column()
  pedido_id: number;

  @Column()
  nombre_empresa: string;

  @ManyToOne(() => Pedido, pedido => pedido.detallePedidos)
  pedido: Pedido;

  // Otras columnas y relaciones...
}
