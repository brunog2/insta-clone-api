import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Check, ManyToOne } from 'typeorm';
import { Post } from './Post.entity';
import { Comment } from './Comment.entity';

@Entity()
export class Like extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 1000 })
    content: string;

    @ManyToOne(() => Post, post => post.likes)
    post: Post;

    @ManyToOne(() => Comment, comment => comment.likes)
    comment: Comment;
}