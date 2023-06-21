import Koa from "koa"
import Router from "@koa/router"
import koaBody from "koa-body"
import { WebhookResponse } from "./zodobjects/webhook-response"
import { sendWebhookResponse } from "./rpc"

const app = new Koa()
const router = new Router()
const port = 80

router.post("/webhook", koaBody(), async (ctx, next) => {
  // ctx.router available
  console.log(ctx.request.body.meta.event_type)

  const res = WebhookResponse.safeParse(ctx.request.body)
  if (!res.success) {
    ctx.response.status = 200
    ctx.response.body = "Received. We dont want this event but thanks anyway :^)"
    return await next()
  }

  sendWebhookResponse(res.data)
})

app.use(router.routes()).use(router.allowedMethods())
app.listen(port)
