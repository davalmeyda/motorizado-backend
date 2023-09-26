import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Pedido } from './pedido.entity';
import { Direccion } from './direcciones.entity';

@Entity({ name: 'direcciones_sobres_detalle' })
export class DireccionDT {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Direccion, direccion => direccion.direciones)
    @JoinColumn({name: 'id_direccion_sobres'})
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
}
