import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Pedido } from './pedido.entity';
import { AutorizacionBancaDigitalImagenes } from './autorizacion_banca_imagenes.entity';

@Entity({ name: 'autorizacion_banca_digital' })
export class AutorizacionBancaDigital {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Pedido, pedido => pedido.autorizacionBancaDigital)
	@JoinColumn({ name: 'pedido_id' }) // Nombre correcto de la columna en la tabla pedidos_anulacions
	pedido: Pedido;

	@OneToMany(() => AutorizacionBancaDigitalImagenes, abdi => abdi.autorizacionBancaDigital)
	autorizacionBancaDigitalImagenes: AutorizacionBancaDigitalImagenes[];

}
