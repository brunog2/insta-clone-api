import express, { response } from 'express';
import { Post } from '../entities/Post.entity';
import { User } from '../entities/User.entity';
import axios from 'axios';

export default class PostController {
    public async store(req: express.Request, res: express.Response) {
        console.log(`[POSTCONTROLLER] Attemping to ${req.method} 'store'`);
        try {
            const { img_url, description, user_id } = req.body;
            console.log(img_url, description, user_id, parseInt(user_id));
            const user = await User.findOne({ id: parseInt(user_id) })

            if (!user) {
                console.error("[POSTCONTROLLER] User doesn't exist");
                return res.status(400).json({ error: "user_does_not_exist" });
            }

            let post = new Post();
            post.img_url = img_url;
            post.description = description;
            post.user = user;

            await Post.save(post);

            console.log("[POSTCONTROLLER] Database query successfull");
            return res.status(200).json({ post });
        }
        catch (error) {
            console.error("[POSTCONTROLLER] Failed");
            res.status(400).send(error);
        }
    }

    public async findAll(req: express.Request, res: express.Response) {
        console.log(`[POSTCONTROLLER] Attemping to ${req.method} 'findAll'`);
        try {
            const posts = await Post.find({
                relations: ["user"],
            });

            console.log("[POSTCONTROLLER] Database query successfull");
            return res.status(200).json({ posts });
        }
        catch (error) {
            console.error("[POSTCONTROLLER] Failed");
            res.status(400).send(error);
        }
    }

    public async delete(req: express.Request, res: express.Response) {
        console.log(`[POSTCONTROLLER] Attemping to ${req.method} 'delete'`);
        try {
            const { id, username, password } = req.body;

            async function deletePost() {
                try {
                    const post = await Post.find({ id });
                    console.log("[POSTCONTROLLER] Database query successfull");

                    if (!post) {
                        console.error("[POSTCONTROLLER] Post doesn't exist");
                        return res.status(400).json({ error: "post_does_not_exist" });
                    }

                    await Post.remove(post);
                    console.log("[POSTCONTROLLER] Database query successfull");

                    return res.json({message: "Post deleted"}).status(200);
                } catch (error) {
                    console.error("[POSTCONTROLLER] Failed");
                    return res.status(400).send(error);
                }
            }

            axios.post("http://localhost:3333/login", { username, password }).then((response) => {
                const { auth, error } = response.data;
                if (auth) {
                    deletePost();
                } else return res.json({ error }) 
            })


        }
        catch (error) {
            console.error("[POSTCONTROLLER] Failed");
            res.status(400).send(error);
        }
    }

}

