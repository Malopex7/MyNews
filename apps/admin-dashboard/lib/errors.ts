import { AxiosError } from 'axios';

/**
 * Error codes for common API error scenarios
 */
export const ErrorCodes = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    UNKNOWN: 'UNKNOWN',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * User-friendly error messages for common scenarios
 */
const errorMessages: Record<ErrorCode, string> = {
    [ErrorCodes.NETWORK_ERROR]: 'Unable to connect to the server. Please check your internet connection.',
    [ErrorCodes.UNAUTHORIZED]: 'Your session has expired. Please log in again.',
    [ErrorCodes.FORBIDDEN]: 'You do not have permission to perform this action.',
    [ErrorCodes.NOT_FOUND]: 'The requested resource was not found.',
    [ErrorCodes.VALIDATION_ERROR]: 'Please check your input and try again.',
    [ErrorCodes.SERVER_ERROR]: 'Something went wrong on our end. Please try again later.',
    [ErrorCodes.UNKNOWN]: 'An unexpected error occurred. Please try again.',
};

/**
 * Parsed error result with code and message
 */
export interface ParsedError {
    code: ErrorCode;
    message: string;
    originalMessage?: string;
}

/**
 * Parse an API error and extract useful information
 */
export function parseApiError(error: unknown): ParsedError {
    // Network/connection errors
    if (error instanceof AxiosError) {
        // No response means network error
        if (!error.response) {
            return {
                code: ErrorCodes.NETWORK_ERROR,
                message: errorMessages[ErrorCodes.NETWORK_ERROR],
                originalMessage: error.message,
            };
        }

        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;

        // Map status codes to error codes
        let code: ErrorCode;
        switch (status) {
            case 401:
                code = ErrorCodes.UNAUTHORIZED;
                break;
            case 403:
                code = ErrorCodes.FORBIDDEN;
                break;
            case 404:
                code = ErrorCodes.NOT_FOUND;
                break;
            case 400:
            case 422:
                code = ErrorCodes.VALIDATION_ERROR;
                break;
            case 500:
            case 502:
            case 503:
                code = ErrorCodes.SERVER_ERROR;
                break;
            default:
                code = ErrorCodes.UNKNOWN;
        }

        return {
            code,
            message: serverMessage || errorMessages[code],
            originalMessage: serverMessage,
        };
    }

    // Standard Error objects
    if (error instanceof Error) {
        return {
            code: ErrorCodes.UNKNOWN,
            message: error.message || errorMessages[ErrorCodes.UNKNOWN],
            originalMessage: error.message,
        };
    }

    // String errors
    if (typeof error === 'string') {
        return {
            code: ErrorCodes.UNKNOWN,
            message: error,
            originalMessage: error,
        };
    }

    // Unknown error type
    return {
        code: ErrorCodes.UNKNOWN,
        message: errorMessages[ErrorCodes.UNKNOWN],
    };
}

/**
 * Get a user-friendly message from any error
 */
export function getErrorMessage(error: unknown): string {
    return parseApiError(error).message;
}

/**
 * Check if error is an authentication error (should redirect to login)
 */
export function isAuthError(error: unknown): boolean {
    const parsed = parseApiError(error);
    return parsed.code === ErrorCodes.UNAUTHORIZED;
}

/**
 * Check if error is a network/connection error
 */
export function isNetworkError(error: unknown): boolean {
    const parsed = parseApiError(error);
    return parsed.code === ErrorCodes.NETWORK_ERROR;
}
