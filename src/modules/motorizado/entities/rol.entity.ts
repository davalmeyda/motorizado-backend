import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'roles' })
export class Rol {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	guard_name: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
