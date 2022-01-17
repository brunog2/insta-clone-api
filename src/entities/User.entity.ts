import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Check, OneToMany } from 'typeorm';
import { Post } from './Post.entity';
import { Comment } from './Comment.entity';
import { Like } from './Like.entity';

@Entity()
@Check(`("email" IS NULL AND "phone_number" IS NOT NULL) OR ("phone_number" IS NULL AND "email" IS NOT NULL)`)
export class User extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", { length: 70 })
    full_name: string;

    @Column("varchar", { length: 100, nullable: true })
    email: string;

    @Column("varchar", { length: 15, nullable: true })
    phone_number: string;

    @Column("varchar", { length: 30 })
    username: string;

    @Column("varchar", { length: 60 })
    password: string;

    @OneToMany(() => Post, post => post.user)
    posts: Post[]

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[]

    @OneToMany(() => Like, like => like.user)
    likes: Like[]
}