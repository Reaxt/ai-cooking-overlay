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
import { Donation, Notification, PollOption, Reward, Target } from "./types"

const app = new Koa()
const router = new Router()
const port = 80
const credentials: TiltifyApiConfig = {
  clientID: process.env.TILTIFY_CLIENT_ID!,
  clientSecret: process.env.TILTIFY_CLIENT_SECRET!,
  APIToken: process.env.TILTIFY_API_TOKEN!,
  campaignID: process.env.TILTIFY_CAMPAIGN_ID!,
}

router.post("/webhook", koaBody(), async (ctx, next) => {
  // ctx.router available
  console.log(ctx.request.body.meta.event_type)

  const res = WebhookResponse.safeParse(ctx.request.body)
  if (!res.success) {
    ctx.response.status = 200
    ctx.response.body = "Received. We dont want this event but thanks anyway :^)"
    return await next()
  }
  const notification = await generateNotification(res.data)
  sendWebhookResponse(notification)
})

const connectionManager = new TiltifyConnectionManager(
  "https://v5api.tiltify.com/",
  credentials,
)
async function generateNotification(res: WebhookResponse) {
  const campaign = await connectionManager.GenerateCampaign()
  const donationData = res.data
  let reward: Reward | null = null
  if (donationData.reward_id != undefined && donationData.reward_id != null) {
    const possibleReward = campaign.rewards.filter(
      (x) => x.id == donationData.reward_id,
    )
    if (possibleReward.length > 0) {
      reward = possibleReward[0]
    }
  }
  let poll: PollOption | null = null
  if (donationData.poll_id != undefined && donationData.poll_id != null) {
    if (
      donationData.poll_option_id != undefined &&
      donationData.poll_option_id != null
    ) {
      const possiblePoll = campaign.polls.filter((x) => x.id == donationData.poll_id)
      if (possiblePoll.length > 0) {
        const option = possiblePoll[0].options.filter(
          (x) => x.id == donationData.poll_option_id,
        )
        if (option.length > 0) poll = option[0]
      }
    }
  }
  let target: Target | null = null
  if (donationData.target_id != undefined && donationData.target_id != null) {
    const possibleTarget = campaign.targets.filter(
      (x) => x.id == donationData.target_id,
    )
    if (possibleTarget.length > 0) {
      target = possibleTarget[0]
    }
  }
  let message: string | null = null
  if (donationData.donor_comment != undefined && donationData.donor_comment != null) {
    message = donationData.donor_comment
  }

  let rewardText: string | null = null
  if (
    donationData.reward_custom_question != undefined &&
    donationData.reward_custom_question != null
  ) {
    rewardText = donationData.reward_custom_question
  }
  const donation: Donation = {
    donator: donationData.donor_name,
    amount: donationData.amount.value,
    message: message,
    reward: reward,
    poll: poll,
    target: target,
    rewardText: rewardText,
    id: donationData.id,
    full: true,
  }
  const notification: Notification = {
    campaign: campaign,
    donation: donation,
  }
  return notification
}

connectionManager.connect().then(() => {
  console.log("yippee!!")
  connectionManager.GenerateCampaign().then((x) => {
    console.log(x)
  })
})
app.use(router.routes()).use(router.allowedMethods())
app.listen(port)
