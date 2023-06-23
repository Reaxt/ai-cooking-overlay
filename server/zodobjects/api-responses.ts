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
  id: z.string(),
  amount: MoneyAmountResponse,
  completed_at: z.string().pipe(z.coerce.date()),
  donor_name: z.string(),
  donor_comment: z.string().nullable().optional(),
  reward_id: z.string().nullable().optional(),
  poll_id: z.string().nullable().optional(),
  poll_option_id: z.string().nullable().optional(),
  target_id: z.string().nullable().optional(),
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
  name: z.string(),
  id: z.string(),
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
  options: z
    .object({
      amount_raised: MoneyAmountResponse,
      name: z.string(),
      id: z.string(),
    })
    .array(),
})
export const PollsResponse = z.object({
  data: PollResponse.array(),
})
export const RewardResponse = z.object({
  amount: MoneyAmountResponse,
  description: z.string(),
  name: z.string(),
  id: z.string(),
})
export const RewardsResponse = z.object({
  data: RewardResponse.array(),
})
