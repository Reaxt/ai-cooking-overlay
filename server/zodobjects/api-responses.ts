import z from "zod"

export const MoneyAmountResponse = z.object({
  currency: z.string(),
  value: z.string().pipe(z.coerce.number()),
})

const ACCEPTED_SCOPE = ["public"] as const
export const OAuthResponse = z.object({
  access_token: z.string(),
  created_at: z.string().pipe(z.coerce.date()),
  expires_in: z.number(),
  scope: z.enum(ACCEPTED_SCOPE),
})

export const DonationResponse = z.object({
  amount: MoneyAmountResponse,
  completed_at: z.string().pipe(z.coerce.date()),
  donor_name: z.string(),
  donor_comment: z.string().nullable(),
  reward_id: z.string(),
})
export const DonationsReponse = z.object({
  data: DonationResponse.array(),
})

export const TargetResponse = z.object({
  active: z.boolean(),
  amount: MoneyAmountResponse,
  amount_raised: MoneyAmountResponse,
  name: z.string(),
  id: z.string(),
})
export const TargetsResponse = z.object({
  data: TargetResponse.array(),
})

export const CampaignResponse = z.object({
  amount_raised: MoneyAmountResponse,
  goal: MoneyAmountResponse,
})

export const MilestoneResponse = z.object({
  active: z.boolean(),
  amount: MoneyAmountResponse,
})
export const MilestonesResponse = z.object({
  data: MilestoneResponse.array(),
})

export const PollResponse = z.object({
  active: z.boolean(),
  amount_raised: MoneyAmountResponse,
  id: z.string(),
  name: z.string(),
  options: z.object({
    amount_raised: MoneyAmountResponse,
    name: z.string(),
  }),
})
export const PollsResponse = z.object({
  data: PollResponse.array(),
})
