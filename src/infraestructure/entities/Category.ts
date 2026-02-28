import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("category")
export class Category {
  @PrimaryGeneratedColumn()
  id_category!: number;

  @Column({ type: "character varying", length: 255 })
  name_category!: string;

  @Column({ type: "text", nullable: true })
  description_category!: string;

  @Column({ type: "integer", default: 1 })
  status_category!: number;
}
