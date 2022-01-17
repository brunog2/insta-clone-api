import express from 'express';
import { Post } from '../entities/Post.entity';
import { User } from '../entities/User.entity';
import bcrypt from 'bcrypt';
import { decode } from 'jsonwebtoken';
import authToken from '../services/auth';


type postColumn = {
    [key: string]: 'description' | 'img_url'
}

export default class PostController {
    public async store(req: express.Request, res: express.Response) {
        console.log(`[POSTCONTROLLER] Attemping to ${req.method} 'store'`);
        try {
            const { img_url, description, user_id } = req.body;
            console.log(img_url, description, user_id);
            const user = await User.findOne({ id: user_id })

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
            const { id } = req.body;
            let { token } = req.cookies;

            const post = await Post.findOne({ relations: ['user'], where: { id } });

            console.log(post, post?.user.id);

            async function deletePost(user_id: string) {

                console.log("[POSTCONTROLLER] Database query successfull");

                if (!post) {
                    console.error("[POSTCONTROLLER] Post doesn't exist");
                    return res.status(404).json({ error: "post_does_not_exist" });
                }


                const sameUser = bcrypt.compareSync(post.user.id, user_id);
                console.log(sameUser);


                if (sameUser) {
                    await Post.remove(post);
                    console.log("[POSTCONTROLLER] Database query successfull");

                    return res.json({ message: "Post deleted" }).status(200);
                } else {
                    return res.json({ error: "user_not_owner" }).status(401);

                }

            }

            const tokenValid = authToken(token);

            console.log("valid", tokenValid);


            if (tokenValid.auth) {
                const decodedToken = decode(token) as { id: string };
                const userId = decodedToken.id;
                deletePost(userId)
            } else {
                return res.json(tokenValid);
            }
        }
        catch (error) {
            console.error("[POSTCONTROLLER] Failed", error);
            res.send(error).status(400);
        }
    }
















    public async update(req: express.Request, res: express.Response) {
        console.log(`[POSTCONTROLLER] Attemping to ${req.method} 'update'`);
        try {
            const { id, value } = req.body;
            let { token } = req.cookies;
            const { column }: postColumn = req.body;

            const post = await Post.findOne({ relations: ['user'], where: { id } });

            console.log(post, post?.user.id);

            console.log("[POSTCONTROLLER] Database query successfull");


            async function updatePost(user_id: string) {



                if (!post) {
                    console.error("[POSTCONTROLLER] Post doesn't exist");
                    return res.status(400).json({ error: "post_does_not_exist" });
                }

                const sameUser = bcrypt.compareSync(post.user.id, user_id);
                console.log(sameUser);

                if (sameUser) {
                    post[column] = value;

                    await Post.save(post);
                    console.log("[POSTCONTROLLER] Database query successfull");

                    return res.json({ message: "Post updated" }).status(200);
                } else {
                    return res.json(tokenValid);
                }

            }


            const tokenValid = authToken(token);

            console.log("valid", tokenValid);


            if (tokenValid.auth) {
                const decodedToken = decode(token) as { id: string };
                const userId = decodedToken.id;
                updatePost(userId)
            } else {
                return res.json(tokenValid);
            }

        }
        catch (error) {
            console.error("[POSTCONTROLLER] Failed", error);
            res.status(400).send(error);
        }
    }
}

