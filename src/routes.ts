import { Router } from 'express';
import UserController from './controllers/UserController';

const router = Router();
const userController = new UserController();

router.get('/', (req, res) => {
    console.log(`[ROUTES] receiving type GET request to '/'`);
    return res.send('You got it!');
});
router.get('/users', userController.findAll);
router.post('/users', userController.store);
router.get('/users/:username', userController.findByUsername);
router.post('/users/delete', userController.delete);
router.post('/users/update', userController.update);

export default router;