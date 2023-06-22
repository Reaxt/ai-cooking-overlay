export type Donation = {
  donator: string
  amount: number
  message: string | null
  full: boolean //if this is from a webhook, and we have 'private' info.
  reward: Reward | null
  Target: Target | null
  poll: PollOption | null
}
export type Reward = {
  id: string
  name: string
  description: string
  imagePath: string
  cost: number
}
export type Target = {
  id: string
  name: string
  cost: number
  amountRaised: number
  active: boolean
  achieved: boolean
}
export type Poll = {
  id: string
  name: string
  amountRaised: number
  active: boolean
  options: PollOption[]
}
export type PollOption = {
  id: string
  name: string
  amountRaised: number
}
export type Milestone = {
  id: string
  name: string
  amount: number
  active: boolean
  achieved: boolean
}
export type Campaign = {
  amount_raised: number
  end_goal: number
  milestones: Milestone[]
  rewards: Reward[]
  polls: Poll[]
  donations: Donation[]
  targets: Target[]
}

export type Notification = {
  donation: Donation | null
  campaign: Campaign
}
