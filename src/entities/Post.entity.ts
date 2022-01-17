import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { User } from './User.entity';
import { Comment } from './Comment.entity';
import { Like } from './Like.entity';

@Entity()
export class Post extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", { length: 128 })
    img_url: string;

    @Column("varchar", { length: 1024, nullable: true })
    description: string;

    @ManyToOne(() => User, user => user.posts)
    user: User;

    @OneToMany(() => Comment, comment => comment.post, { nullable: true })
    comments: Comment[]

    @OneToMany(() => Like, like => like.post, { nullable: true })
    likes: Like[]

}