const Koa = require('koa');
const KoaRouter = require('koa-router');
const json = require('koa-json');
const bodyParser = require('koa-bodyparser');
const Knex = require('knex');
const knexConfig = require('./knexfile');
const { Model } = require('objection');

// Initialize knex.
const knex = Knex(knexConfig.development)
Model.knex(knex);

const app = new Koa();
const router = new KoaRouter();
const dotenv = require('dotenv');
dotenv.config();


// Middleware
app.use(json());
app.use(bodyParser())


// Router Middleware
app.use(router.routes())
app.use(router.allowedMethods())

// listening to port
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Application started at port: ${port}`);
})