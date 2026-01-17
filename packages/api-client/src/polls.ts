import { AxiosInstance } from 'axios';
import type {
    CreatePollInput,
    VoteInput,
    PollWithUserVote,
    PollResults,
} from '@packages/schemas';

export const createPollsApi = (client: AxiosInstance) => ({
    /**
     * Create a poll for a trailer
     */
    createPoll: async (data: CreatePollInput) => {
        const response = await client.post('/polls', data);
        return response.data;
    },

    /**
     * Get poll by media ID
     */
    getPollByMediaId: async (mediaId: string): Promise<PollWithUserVote> => {
        const response = await client.get(`/polls/media/${mediaId}`);
        return response.data;
    },

    /**
     * Vote on a poll
     */
    vote: async (pollId: string, data: VoteInput): Promise<PollWithUserVote> => {
        const response = await client.post(`/polls/${pollId}/vote`, data);
        return response.data;
    },

    /**
     * Get poll results
     */
    getResults: async (pollId: string): Promise<PollResults> => {
        const response = await client.get(`/polls/${pollId}/results`);
        return response.data;
    },
});

export type PollsApi = ReturnType<typeof createPollsApi>;
