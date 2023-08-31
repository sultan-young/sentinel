import koa from 'koa'
import Router from 'koa-router';
console.log('koa: ', koa);
const app = new koa();
const router = new Router();
router.get('/test', (ctx, next) => {
    console.log(111)
})

app.use(router.routes())

app.listen(3000, () => {
    console.log('预警系统启动')
})