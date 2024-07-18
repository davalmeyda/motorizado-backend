import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AutorizacionBancaDigital } from './autorizacion_banca.entity';


@Entity({ name: 'autorizacion_banca_digital_imagenes' })
export class AutorizacionBancaDigitalImagenes {
  @PrimaryGeneratedColumn()
  id: number;

//   @ManyToOne(() => AutorizacionBancaDigital, abd => abd.autorizacionBancaDigitalImagenes)
//   autorizacionBancaDigital: AutorizacionBancaDigital;

  @ManyToOne(() => AutorizacionBancaDigital, abd => abd.autorizacionBancaDigitalImagenes)
  @JoinColumn({ name: 'banca_digital_id' }) // Nombre correcto de la columna en la tabla pedidos_anulacions
  autorizacionBancaDigital: AutorizacionBancaDigital;

  // Otras columnas y relaciones...
}
