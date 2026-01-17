export const POLL_TEMPLATES = {
    sequel: {
        question: 'Want a sequel?',
        options: ['Yes! 🔥', 'Maybe 🤔', 'Nah 👎'],
    },
    cast: {
        question: 'Who should star in this?',
        options: [], // Custom options provided by creator
    },
    rating: {
        question: 'Rate this concept',
        options: ['🔥 Fire', '👍 Good', '🤔 Interesting', '👎 Pass'],
    },
    custom: {
        question: '', // Custom question
        options: [], // Custom options
    },
} as const;

export type PollTemplateKey = keyof typeof POLL_TEMPLATES;
