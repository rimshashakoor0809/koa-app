const Koa = require('koa');
const KoaRouter = require('koa-router');
const json = require('koa-json');
const app = new Koa();
const router = new KoaRouter();
const dotenv = require('dotenv');
dotenv.config();


// JSON Prettier Middleware
app.use(json());

// Simple Middleware Example
// app.use(async ctx => ctx.body = { message: 'Hello World' });


// Router Middleware
app.use(router.routes()).use(router.allowedMethods())

router.get('/test:name', ctx => {
  console.log('params', ctx.params)
  ctx.body = `This is Test Route for ${ctx.params.name}`
});

// listening to port
const port = 4400;
app.listen(port, () => {
  console.log(`Application started at port: ${port}`);
})