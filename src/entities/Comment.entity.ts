import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne } from 'typeorm';
import { User } from './User.entity';
import { Post } from './Post.entity';
import { Like } from './Like.entity';

@Entity()
export class Comment extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 1000 })
    content: string;

    @OneToMany(() => Like, like => like.post)
    likes: Like[]

    @ManyToOne(() => Post, post => post.comments)
    post: Post;
    
    @ManyToOne(() => User, user => user.posts)
    user: User;

    // self relationship - a comment can have multiple child comments
    // the self comment
    @ManyToOne(type => Comment, comment => comment.children)
    parent: Comment;

    // a reply to base comment
    @OneToMany(type => Comment, comment => comment.parent)
    children: Comment[];

}