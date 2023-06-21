export type Donation = {
  donator: string
  amount: number
}
export type Reward = {
  name: string
  description: string
  imagePath: string
  cost: number
}
export type Target = {
  name: string
  cost: number
  amountRaised: number
  active: boolean
  achieved: boolean
}
export type Poll = {
  name: string
  amountRaised: number
  active: boolean
  options: PollOption[]
}
export type PollOption = {
  name: string
  amountRaised: number
}
export type Milestone = {
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
