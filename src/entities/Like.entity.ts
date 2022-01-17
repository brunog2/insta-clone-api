import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Check, ManyToOne } from 'typeorm';
import { User } from './User.entity';
import { Post } from './Post.entity';
import { Comment } from './Comment.entity';

@Entity()
export class Like extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", { length: 1000 })
    content: string;

    @ManyToOne(() => Post, post => post.likes)
    post: Post;

    @ManyToOne(() => Comment, comment => comment.likes)
    comment: Comment;

    @ManyToOne(() => User, user => user.posts)
    user: User;
}