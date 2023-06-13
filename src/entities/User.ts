import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'
import { Person } from './utils/Person'

@Entity('User')
export class User extends Person {
  @Column()
  password: string

  @Column()
  phone_number: string

  @Column({ default: '/images/avatar.png' })
  image_url: string
}
