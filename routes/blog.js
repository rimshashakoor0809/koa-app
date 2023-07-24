const Router = require('koa-router');
const BlogController = require('../controllers/blog');
const authorize = require('../utils/VerifyUser');
const router = new Router();

router.post('/blogs', authorize.verifyUser, BlogController.createBlog);

router.patch('/blogs/:blogId', authorize.verifyUser, BlogController.updateBlog);

router.delete('/blogs/:blogId', authorize.verifyUser, BlogController.deleteBlog);

router.get('/blogs/published', BlogController.getAllPublishedBlogs);

router.get('/blogs/me', authorize.verifyUser, BlogController.getAllUserBlogs);

module.exports = router;