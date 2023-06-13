import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Client } from './Client'

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

@Entity('transaction')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'enum', enum: TransactionType })
  type: string

  @Column({ type: 'numeric' })
  amount: number

  @ManyToOne(() => Client, (client) => client.transactions, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'client_id',
  })
  client: Client

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
