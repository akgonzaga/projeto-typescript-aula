import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import Pesquisador from "./Pesquisador.js";

@Entity("refresh_tokens")
export default class RefreshToken {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", unique: true })
  jti: string;

  @ManyToOne(() => Pesquisador, { onDelete: "CASCADE" })
  pesquisador: Pesquisador;

  @CreateDateColumn()
  createdAt: Date;
  
}
