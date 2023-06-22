import axios from "axios"
import {
  CampaignResponse,
  DonationsReponse,
  MilestonesResponse,
  OAuthResponse,
  PollsResponse,
  TargetsResponse,
} from "../zodobjects/api-responses"

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
      this.baseURL + `/api/public/campaigns/${this.credentials.campaignID}/targers`,
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
  public async GetPolls() {
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
    const parsed = PollsResponse.safeParse(res.data)
    if (!parsed.success) throw parsed.error
    return parsed.data
  }
  public async GenerateFullCampaign() {
    const campaignRes = this.GetCampaign()
    const pollsRes = this.GetPolls()
    const targetsRes = this.GetTargets()
  }
}
