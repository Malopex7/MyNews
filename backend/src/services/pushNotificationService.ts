import { Expo, ExpoPushMessage, ExpoPushTicket, ExpoPushSuccessTicket } from 'expo-server-sdk';

const expo = new Expo();

interface PushNotificationData {
    trailerId?: string;
    type?: string;
    [key: string]: any;
}

/**
 * Send push notification to a single device
 */
export const sendPushNotification = async (
    pushToken: string,
    title: string,
    body: string,
    data?: PushNotificationData
): Promise<ExpoPushTicket | null> => {
    if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Invalid Expo push token: ${pushToken}`);
        return null;
    }

    const message: ExpoPushMessage = {
        to: pushToken,
        sound: 'default',
        title,
        body,
        data: data || {},
    };

    try {
        const tickets = await expo.sendPushNotificationsAsync([message]);
        return tickets[0];
    } catch (error) {
        console.error('Error sending push notification:', error);
        return null;
    }
};

/**
 * Send push notifications to multiple devices
 */
export const sendBatchNotifications = async (
    pushTokens: string[],
    title: string,
    body: string,
    data?: PushNotificationData
): Promise<ExpoPushTicket[]> => {
    // Filter out invalid tokens
    const validTokens = pushTokens.filter(token => Expo.isExpoPushToken(token));

    if (validTokens.length === 0) {
        console.warn('No valid push tokens provided');
        return [];
    }

    const messages: ExpoPushMessage[] = validTokens.map(token => ({
        to: token,
        sound: 'default',
        title,
        body,
        data: data || {},
    }));

    try {
        // Chunk messages for Expo API limits (100 at a time)
        const chunks = expo.chunkPushNotifications(messages);
        const tickets: ExpoPushTicket[] = [];

        for (const chunk of chunks) {
            try {
                const chunkTickets = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...chunkTickets);
            } catch (error) {
                console.error('Error sending notification chunk:', error);
            }
        }

        return tickets;
    } catch (error) {
        console.error('Error in batch notification sending:', error);
        return [];
    }
};

/**
 * Check receipt status of push notifications
 * This is useful for identifying invalid tokens
 */
export const checkReceiptStatus = async (receiptIds: string[]): Promise<void> => {
    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

    for (const chunk of receiptIdChunks) {
        try {
            const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

            for (const receiptId in receipts) {
                const receipt = receipts[receiptId];

                if (receipt.status === 'error') {
                    console.error(`Error sending notification: ${receipt.message}`);

                    // DeviceNotRegistered means the token is invalid
                    if (receipt.details?.error === 'DeviceNotRegistered') {
                        console.warn(`Token is invalid: ${receiptId}`);
                        // TODO: Remove this token from database
                    }
                }
            }
        } catch (error) {
            console.error('Error checking receipts:', error);
        }
    }
};
