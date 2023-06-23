import axios from "axios"
import {
  CampaignResponse,
  DonationsReponse,
  MilestonesResponse,
  OAuthResponse,
  PollsResponse,
  RewardsResponse,
  TargetsResponse,
} from "../zodobjects/api-responses"
import {
  Campaign,
  Donation,
  Milestone,
  Poll,
  PollOption,
  Reward,
  Target,
} from "../types"

export type TiltifyApiConfig = {
  clientID: string
  clientSecret: string
  APIToken: string
  campaignID: string
}
export type OAuthSession = {
  accessToken: string
  creationtime: Date
  expiryAtCreation: number
}
export class TiltifyConnectionManager {
  private baseURL: string
  private credentials: TiltifyApiConfig
  private authSession: OAuthSession | null = null
  constructor(base_api_url: string, credentials: TiltifyApiConfig) {
    this.baseURL = base_api_url
    this.credentials = credentials
  }
  public async connect() {
    const res = await axios.post(this.baseURL + "oauth/token", null, {
      params: {
        client_id: this.credentials.clientID,
        client_secret: this.credentials.clientSecret,
        scope: "public",
        grant_type: "client_credentials",
      },
    })
    if (res.status != 200) {
      throw new Error("Failed to get oauth token from api!! This is VERY BAD")
    }
    const parsed = OAuthResponse.safeParse(res.data)
    if (!parsed.success) {
      throw parsed.error
    }
    this.authSession = {
      accessToken: parsed.data.access_token,
      creationtime: parsed.data.created_at,
      expiryAtCreation: parsed.data.expires_in,
    }
    console.log(
      new Date(
        this.authSession.creationtime.getTime() +
          this.authSession.expiryAtCreation * 1000,
      ).getHours(),
    )
    console.log(this.authSession.creationtime.getHours())
    return true
  }
  public async checkAndRefresh() {
    if (this.authSession == null) {
      try {
        await this.connect()
      } catch (e) {
        console.log("oh we fucked up BAD." + e)
      }
    }
    if (this.authSession == null) return
    const expiredDate = new Date(
      this.authSession.creationtime.getTime() +
        this.authSession.expiryAtCreation * 1000,
    )
    if (Date.now() > expiredDate.getTime()) {
      //expired
      console.log("we where expired. refreshing")
      await this.connect()
    }
    return
  }

  public async GetCampaign() {
    await this.checkAndRefresh()
    const res = await axios.get(
      this.baseURL + `/api/public/campaigns/${this.credentials.campaignID}`,
      {
        headers: {
          Authorization: `Bearer ${this.authSession?.accessToken}`,
        },
      },
    )
    console.log(res.data)
    if (res.status != 200) throw new Error("Getting campaign failed. :" + res.data)
    const parsed = CampaignResponse.safeParse(res.data.data)
    if (!parsed.success) throw parsed.error
    return parsed.data
  }
  public async GetMilestones() {
    await this.checkAndRefresh()
    const res = await axios.get(
      this.baseURL + `/api/public/campaigns/${this.credentials.campaignID}/milestones`,
      {
        headers: {
          Authorization: `Bearer ${this.authSession?.accessToken}`,
        },
      },
    )
    if (res.status != 200) throw new Error("Getting milestones failed. " + res.data)
    const parsed = MilestonesResponse.safeParse(res.data)
    if (!parsed.success) throw parsed.error
    return parsed.data
  }
  public async GetTargets() {
    await this.checkAndRefresh()
    const res = await axios.get(
      this.baseURL + `/api/public/campaigns/${this.credentials.campaignID}/targets`,
      {
        headers: {
          Authorization: `Bearer ${this.authSession?.accessToken}`,
        },
      },
    )
    if (res.status != 200) throw new Error("Getting targets failed. " + res.data)
    const parsed = TargetsResponse.safeParse(res.data)
    if (!parsed.success) throw parsed.error
    return parsed.data
  }
  public async GetDonations() {
    await this.checkAndRefresh()
    const res = await axios.get(
      this.baseURL + `/api/public/campaigns/${this.credentials.campaignID}/donations`,
      {
        headers: {
          Authorization: `Bearer ${this.authSession?.accessToken}`,
        },
      },
    )
    if (res.status != 200) throw new Error("Getting milestones failed. " + res.data)
    const parsed = DonationsReponse.safeParse(res.data)
    if (!parsed.success) throw parsed.error
    return parsed.data
  }
  public async GetRewards() {
    await this.checkAndRefresh()
    const res = await axios.get(
      this.baseURL + `/api/public/campaigns/${this.credentials.campaignID}/rewards`,
      {
        headers: {
          Authorization: `Bearer ${this.authSession?.accessToken}`,
        },
        params: {
          limit: 50,
        },
      },
    )
    if (res.status != 200) throw new Error("Getting milestones failed. " + res.data)
    const parsed = RewardsResponse.safeParse(res.data)
    if (!parsed.success) throw parsed.error
    return parsed.data
  }
  public async GetPolls() {
    await this.checkAndRefresh()
    const res = await axios.get(
      this.baseURL + `/api/public/campaigns/${this.credentials.campaignID}/polls`,
      {
        headers: {
          Authorization: `Bearer ${this.authSession?.accessToken}`,
        },
      },
    )
    if (res.status != 200) throw new Error("Getting poll failed. " + res.data)
    const parsed = PollsResponse.safeParse(res.data)
    if (!parsed.success) throw parsed.error
    return parsed.data
  }
  public async GenerateCampaign() {
    const campaignRes = await this.GetCampaign()
    const pollsRes = await this.GetPolls()
    const targetsRes = await this.GetTargets()
    const milestonesRes = await this.GetMilestones()
    const donationsRes = await this.GetDonations()
    const rewardsRes = await this.GetRewards()

    const milestones: Milestone[] = []
    milestonesRes.data.forEach((element) => {
      milestones.push({
        name: element.name,
        id: element.id,
        active: element.active,
        amount: element.amount.value,
        achieved: campaignRes.amount_raised.value >= element.amount.value,
      })
    })
    const rewards: Reward[] = []
    rewardsRes.data.forEach((element) => {
      rewards.push({
        id: element.id,
        name: element.name,
        description: element.description,
        cost: element.amount.value,
      })
    })
    const targets: Target[] = []
    targetsRes.data.forEach((element) => {
      targets.push({
        id: element.id,
        name: element.name,
        cost: element.amount.value,
        amountRaised: element.amount_raised.value,
        active: element.active,
        achieved: element.amount_raised.value > element.amount.value,
        amount: element.amount.value,
      })
    })
    const polls: Poll[] = []
    pollsRes.data.forEach((element) => {
      const pollOptions: PollOption[] = []
      element.options.forEach((option) => {
        pollOptions.push({
          name: option.name,
          amountRaised: option.amount_raised.value,
          id: option.id,
        })
      })
      polls.push({
        name: element.name,
        id: element.id,
        options: pollOptions,
        amountRaised: element.amount_raised.value,
        active: element.active,
      })
    })
    const donations: Donation[] = []
    donationsRes.data.forEach((element) => {
      let reward: Reward | null = null
      if (element.reward_id != undefined && element.reward_id != null) {
        const possibleReward = rewards.filter((x) => x.id == element.reward_id)
        if (possibleReward.length > 0) {
          reward = possibleReward[0]
        }
      }

      let poll: PollOption | null = null
      if (element.poll_id != undefined && element.poll_id != null) {
        if (element.poll_option_id != undefined && element.poll_option_id != null) {
          const possiblePoll = polls.filter((x) => x.id == element.poll_id)
          if (possiblePoll.length > 0) {
            const option = possiblePoll[0].options.filter(
              (x) => x.id == element.poll_option_id,
            )
            if (option.length > 0) poll = option[0]
          }
        }
      }

      let target: Target | null = null
      if (element.target_id != undefined && element.target_id != null) {
        const possibleTarget = targets.filter((x) => x.id == element.target_id)
        if (possibleTarget.length > 0) {
          target = possibleTarget[0]
        }
      }

      let message: string | null = null
      if (element.donor_comment != undefined && element.donor_comment != null) {
        message = element.donor_comment
      }
      donations.push({
        donator: element.donor_name,
        message: message,
        full: false,
        reward: reward,
        poll: poll,
        target: target,
        id: element.id,
        amount: element.amount.value,
        rewardText: null,
      })
    })
    const campaign: Campaign = {
      amount_raised: campaignRes.amount_raised.value,
      end_goal: campaignRes.goal.value,
      milestones: milestones,
      targets: targets,
      polls: polls,
      donations: donations,
      rewards: rewards,
    }
    return campaign
  }
}
