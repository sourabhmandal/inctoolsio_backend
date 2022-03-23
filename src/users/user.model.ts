import { Field, Int, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Users {
  @PrimaryGeneratedColumn('increment')
  @Field((type) => Int)
  id: number;

  @Column({ nullable: false })
  @Field({ nullable: false })
  name: string;

  @Column({ nullable: false })
  @Field({ nullable: false })
  email: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  locale?: string;

  @Column({ nullable: true, default: 'admin' })
  @Field({ nullable: true, defaultValue: 'admin' })
  role?: string;

  @Column({ default: Date.now(), nullable: false })
  @Field((type) => GraphQLISODateTime, {
    defaultValue: Date.now(),
    nullable: false,
  })
  created_at: string;

  @Column({ default: Date.now() })
  @Field((type) => GraphQLISODateTime, {
    defaultValue: Date.now(),
    nullable: false,
  })
  updated_at: string;
}
