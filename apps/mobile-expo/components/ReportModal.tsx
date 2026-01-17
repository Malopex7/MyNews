import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { REPORT_REASONS } from '@packages/domain';
import { useAuthStore } from '../state/authStore';

interface ReportModalProps {
    visible: boolean;
    onClose: () => void;
    contentType: 'trailer' | 'comment';
    contentId: string;
    onSubmitSuccess?: () => void;
}

const REASON_LABELS: Record<string, string> = {
    [REPORT_REASONS.INAPPROPRIATE]: 'Inappropriate Content',
    [REPORT_REASONS.SPAM]: 'Spam',
    [REPORT_REASONS.COPYRIGHT]: 'Copyright Violation',
    [REPORT_REASONS.HARASSMENT]: 'Harassment',
    [REPORT_REASONS.OTHER]: 'Other',
};

export function ReportModal({ visible, onClose, contentType, contentId, onSubmitSuccess }: ReportModalProps) {
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [details, setDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const accessToken = useAuthStore((state: any) => state.accessToken);

    const handleSubmit = async () => {
        if (!selectedReason) {
            setError('Please select a reason');
            return;
        }

        if (!accessToken) {
            setError('You must be logged in to report content');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3001/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    contentType,
                    contentId,
                    reason: selectedReason,
                    details: details.trim() || undefined,
                }),
            });

            if (response.status === 409) {
                setError('You have already reported this content');
                setIsSubmitting(false);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to submit report');
            }

            // Success
            setSelectedReason(null);
            setDetails('');
            onSubmitSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to submit report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedReason(null);
        setDetails('');
        setError(null);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-[#18181b] rounded-t-3xl p-6 max-h-[80%]">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-gray-100 text-xl font-bold">
                            Report {contentType === 'trailer' ? 'Trailer' : 'Comment'}
                        </Text>
                        <TouchableOpacity onPress={handleClose}>
                            <Ionicons name="close" size={24} color="#a1a1aa" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Reason Selection */}
                        <Text className="text-gray-300 text-sm mb-3">
                            Why are you reporting this content?
                        </Text>

                        {Object.entries(REASON_LABELS).map(([value, label]) => (
                            <TouchableOpacity
                                key={value}
                                className={`flex-row items-center p-4 rounded-lg mb-2 ${selectedReason === value ? 'bg-amber-500/20 border-2 border-amber-500' : 'bg-[#27272a]'
                                    }`}
                                onPress={() => setSelectedReason(value)}
                            >
                                <View
                                    className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${selectedReason === value ? 'border-amber-500' : 'border-gray-600'
                                        }`}
                                >
                                    {selectedReason === value && (
                                        <View className="w-3 h-3 rounded-full bg-amber-500" />
                                    )}
                                </View>
                                <Text className="text-gray-100 text-base">{label}</Text>
                            </TouchableOpacity>
                        ))}

                        {/* Optional Details */}
                        <Text className="text-gray-300 text-sm mt-4 mb-2">
                            Additional details (optional)
                        </Text>
                        <TextInput
                            className="bg-[#27272a] text-gray-100 p-4 rounded-lg min-h-[100px]"
                            placeholder="Provide more context..."
                            placeholderTextColor="#71717a"
                            value={details}
                            onChangeText={setDetails}
                            multiline
                            maxLength={500}
                            textAlignVertical="top"
                        />
                        <Text className="text-gray-500 text-xs mt-1 text-right">
                            {details.length}/500
                        </Text>

                        {/* Error Message */}
                        {error && (
                            <View className="bg-red-500/20 border border-red-500 rounded-lg p-3 mt-3">
                                <Text className="text-red-400 text-sm">{error}</Text>
                            </View>
                        )}

                        {/* Submit Button */}
                        <TouchableOpacity
                            className={`mt-6 p-4 rounded-lg ${selectedReason && !isSubmitting
                                ? 'bg-amber-500'
                                : 'bg-gray-700'
                                }`}
                            onPress={handleSubmit}
                            disabled={!selectedReason || isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white text-center font-bold text-base">
                                    Submit Report
                                </Text>
                            )}
                        </TouchableOpacity>

                        <Text className="text-gray-500 text-xs text-center mt-3">
                            Reports are reviewed by our moderation team
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
