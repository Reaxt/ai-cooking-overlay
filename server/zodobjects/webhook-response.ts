import z from "zod"
import { MoneyAmountResponse } from "./api-responses"

const ACCEPTED_EVENT_TYPES = [
  "private:direct:donation_updated",
  "public:direct:donation_updated",
] as const

export const WebhookResponse = z.object({
  data: z.object({
    id: z.string(),
    amount: MoneyAmountResponse,
    campaign_id: z.string(),
    donor_comment: z.string().nullable(), //i dont know if this field is nullable, but FOR NOW before I do better testing.
    donor_name: z.string(), //i dont know if this field is nullable, but FOR NOW before I do better testing.
    fundraising_event_id: z.string(),
    poll_id: z.string().nullable().optional(),
    poll_option_id: z.string().nullable().optional(),
    reward_id: z.string().nullable().optional(),
    reward_custom_question: z.string().nullable().optional(),
    target_id: z.string().nullable().optional(),
  }),
  meta: z.object({
    event_type: z.enum(ACCEPTED_EVENT_TYPES),
  }),
})
export type WebhookResponse = z.infer<typeof WebhookResponse>
