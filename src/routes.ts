import { Router } from 'express';
import UserController from './controllers/UserController';
import PostController from './controllers/PostController';

const router = Router();
const userController = new UserController();
const postController = new PostController();

router.get('/', (req, res) => {
    console.log(`[ROUTES] receiving type GET request to '/'`);
    return res.send('You got it!');
});

// user routes
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/:username/posts', userController.posts);
router.post('/feed', userController.feed);
router.get('/users', userController.findAll);
router.post('/users', userController.store);
router.get('/users/:username', userController.findByUsername);
router.get('/users/email/:email', userController.findByEmail);
router.get('/users/phone/:phone_number', userController.findByPhone);
router.post('/users/delete', userController.delete);
router.post('/users/update', userController.update);

// post routes
router.post('/post', postController.store);
router.get('/post', postController.findAll);
router.post('/posts/delete', postController.delete);
router.post('/posts/update', postController.update);

export default router;