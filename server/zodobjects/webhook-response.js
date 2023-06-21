"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookResponse = void 0;
const zod_1 = __importDefault(require("zod"));
const ACCEPTED_EVENT_TYPES = [
    "private:direct:donation_updated",
    "public:direct:donation_updated",
];
exports.WebhookResponse = zod_1.default.object({
    data: zod_1.default.object({
        amount: zod_1.default.object({
            currency: zod_1.default.string(),
            value: zod_1.default.string().pipe(zod_1.default.coerce.number()),
        }),
        campaign_id: zod_1.default.string(),
        donor_comment: zod_1.default.string().nullable(),
        donor_name: zod_1.default.string().nullable(),
        fundraising_event_id: zod_1.default.string(),
        poll_id: zod_1.default.string().nullable().optional(),
        poll_option_id: zod_1.default.string().nullable().optional(),
        reward_id: zod_1.default.string().nullable().optional(),
        reward_custom_question: zod_1.default.string().nullable().optional(),
        target_id: zod_1.default.string().nullable().optional(),
    }),
    meta: zod_1.default.object({
        event_type: zod_1.default.enum(ACCEPTED_EVENT_TYPES),
    }),
});
