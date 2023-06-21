import z from "zod";
export declare const WebhookResponse: z.ZodObject<{
    data: z.ZodObject<{
        amount: z.ZodObject<{
            currency: z.ZodString;
            value: z.ZodPipeline<z.ZodString, z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            value: number;
            currency: string;
        }, {
            value: string;
            currency: string;
        }>;
        campaign_id: z.ZodString;
        donor_comment: z.ZodNullable<z.ZodString>;
        donor_name: z.ZodNullable<z.ZodString>;
        fundraising_event_id: z.ZodString;
        poll_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        poll_option_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        reward_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        reward_custom_question: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        target_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        amount: {
            value: number;
            currency: string;
        };
        campaign_id: string;
        donor_comment: string | null;
        donor_name: string | null;
        fundraising_event_id: string;
        poll_id?: string | null | undefined;
        poll_option_id?: string | null | undefined;
        reward_id?: string | null | undefined;
        reward_custom_question?: string | null | undefined;
        target_id?: string | null | undefined;
    }, {
        amount: {
            value: string;
            currency: string;
        };
        campaign_id: string;
        donor_comment: string | null;
        donor_name: string | null;
        fundraising_event_id: string;
        poll_id?: string | null | undefined;
        poll_option_id?: string | null | undefined;
        reward_id?: string | null | undefined;
        reward_custom_question?: string | null | undefined;
        target_id?: string | null | undefined;
    }>;
    meta: z.ZodObject<{
        event_type: z.ZodEnum<["private:direct:donation_updated", "public:direct:donation_updated"]>;
    }, "strip", z.ZodTypeAny, {
        event_type: "private:direct:donation_updated" | "public:direct:donation_updated";
    }, {
        event_type: "private:direct:donation_updated" | "public:direct:donation_updated";
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        amount: {
            value: number;
            currency: string;
        };
        campaign_id: string;
        donor_comment: string | null;
        donor_name: string | null;
        fundraising_event_id: string;
        poll_id?: string | null | undefined;
        poll_option_id?: string | null | undefined;
        reward_id?: string | null | undefined;
        reward_custom_question?: string | null | undefined;
        target_id?: string | null | undefined;
    };
    meta: {
        event_type: "private:direct:donation_updated" | "public:direct:donation_updated";
    };
}, {
    data: {
        amount: {
            value: string;
            currency: string;
        };
        campaign_id: string;
        donor_comment: string | null;
        donor_name: string | null;
        fundraising_event_id: string;
        poll_id?: string | null | undefined;
        poll_option_id?: string | null | undefined;
        reward_id?: string | null | undefined;
        reward_custom_question?: string | null | undefined;
        target_id?: string | null | undefined;
    };
    meta: {
        event_type: "private:direct:donation_updated" | "public:direct:donation_updated";
    };
}>;
export type WebhookResponse = z.infer<typeof WebhookResponse>;
