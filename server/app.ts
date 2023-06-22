import Koa from "koa"
import Router from "@koa/router"
import koaBody from "koa-body"
import { WebhookResponse } from "./zodobjects/webhook-response"
import { sendWebhookResponse } from "./rpc"
import {
  TiltifyApiConfig,
  TiltifyConnectionManager,
} from "./tiltify/tiltifyconnectionmanager"
import "dotenv/config"

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

const credentials: TiltifyApiConfig = {
  clientID: process.env.TILTIFY_CLIENT_ID!,
  clientSecret: process.env.TILTIFY_CLIENT_SECRET!,
  APIToken: process.env.TILTIFY_API_TOKEN!,
  campaignID: process.env.TILTIFY_CAMPAIGN_ID!,
}

const connectionManager = new TiltifyConnectionManager(
  "https://v5api.tiltify.com/",
  credentials,
)
connectionManager.connect().then(() => {
  console.log("yippee!!")
  connectionManager.GetCampaign().then((x) => {
    console.log(x)
  })
})
app.use(router.routes()).use(router.allowedMethods())
app.listen(port)
