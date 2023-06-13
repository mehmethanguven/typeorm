import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Person } from './utils/Person'
import { Transaction } from './Transaction'
import { Banker } from './Banker'

@Entity('client')
export class Client extends Person {
  @PrimaryGeneratedColumn()
  id: number
  @Column({
    type: 'numeric',
  })
  balance: number

  @Column({
    unique: true,
    length: 10,
  })
  card_number: string

  @Column({
    default: true,
  })
  is_active: boolean

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  additional_info: {
    age: number
    hair_color: string
  }
  @Column({
    type: 'simple-array',
    default: [],
  })
  family_member: string[]

  @OneToMany(() => Transaction, (transaction) => transaction.client)
  transactions: Transaction[]

  // @BeforeInsert()
  // initializePosts() {
  //   this.transactions = []
  // }

  @ManyToMany(() => Banker)
  bankers: Banker[]
}
