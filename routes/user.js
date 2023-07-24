const Router = require('koa-router');
const UserController = require('../controllers/user');
const router = new Router();

router.post('/users/register', UserController.signUpUser);
router.post('/users/login', UserController.loginUser);

module.exports = router;