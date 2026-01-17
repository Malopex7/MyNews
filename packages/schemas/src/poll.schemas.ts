import { z } from 'zod';

export const PollTemplateTypeSchema = z.enum(['sequel', 'cast', 'rating', 'custom']);

export const CreatePollSchema = z.object({
    mediaId: z.string(),
    templateType: PollTemplateTypeSchema,
    question: z.string().min(5).max(200),
    options: z.array(z.string().min(1).max(100)).min(2).max(6),
});

export const VoteSchema = z.object({
    optionIndex: z.number().int().min(0),
});

export const PollOptionSchema = z.object({
    text: z.string(),
    votes: z.number().int().min(0),
});

export const PollResponseSchema = z.object({
    _id: z.string(),
    mediaId: z.string(),
    creatorId: z.string(),
    templateType: PollTemplateTypeSchema,
    question: z.string(),
    options: z.array(PollOptionSchema),
    totalVotes: z.number().int().min(0),
    expiresAt: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
});

export const PollWithUserVoteSchema = z.object({
    poll: PollResponseSchema,
    userVote: z.number().int().min(0).nullable(),
});

export const PollResultOptionSchema = z.object({
    text: z.string(),
    votes: z.number().int().min(0),
    percentage: z.number().min(0).max(100),
});

export const PollResultsSchema = z.object({
    pollId: z.string(),
    question: z.string(),
    totalVotes: z.number().int().min(0),
    results: z.array(PollResultOptionSchema),
});

// Type exports
export type PollTemplateType = z.infer<typeof PollTemplateTypeSchema>;
export type CreatePollInput = z.infer<typeof CreatePollSchema>;
export type VoteInput = z.infer<typeof VoteSchema>;
export type PollOption = z.infer<typeof PollOptionSchema>;
export type PollResponse = z.infer<typeof PollResponseSchema>;
export type PollWithUserVote = z.infer<typeof PollWithUserVoteSchema>;
export type PollResultOption = z.infer<typeof PollResultOptionSchema>;
export type PollResults = z.infer<typeof PollResultsSchema>;
