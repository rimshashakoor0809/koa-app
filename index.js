const Koa = require('koa');
const KoaRouter = require('koa-router');
const json = require('koa-json');
const bodyParser = require('koa-bodyparser');
const dotenv = require('dotenv');
const { Model } = require('objection');
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');

// Initialize knex.
const Knex = require('knex');
const knexConfig = require('./knexfile');
const knex = Knex(knexConfig.development)
Model.knex(knex);

const app = new Koa();
dotenv.config();


// Middleware
app.use(json());
app.use(bodyParser())


// Router Middleware
app.use(userRoutes.routes())
app.use(userRoutes.allowedMethods())

app.use(blogRoutes.routes())
app.use(blogRoutes.allowedMethods())


// listening to port
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Application started at port: ${port}`);
})