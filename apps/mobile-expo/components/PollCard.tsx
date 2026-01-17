import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import type { PollWithUserVote } from '@packages/schemas';

interface PollCardProps {
    poll: PollWithUserVote['poll'];
    userVote: PollWithUserVote['userVote'];
    onVote: (optionIndex: number) => Promise<void>;
}

export default function PollCard({ poll, userVote, onVote }: PollCardProps) {
    const [voting, setVoting] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(userVote);

    const handleVote = async (optionIndex: number) => {
        if (selectedOption !== null) {
            Alert.alert('Already Voted', 'You have already voted on this poll');
            return;
        }

        setVoting(true);
        try {
            await onVote(optionIndex);
            setSelectedOption(optionIndex);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to submit vote');
        } finally {
            setVoting(false);
        }
    };

    const calculatePercentage = (optionIndex: number) => {
        if (poll.totalVotes === 0) return 0;
        return Math.round((poll.options[optionIndex].votes / poll.totalVotes) * 100);
    };

    return (
        <View className="bg-zinc-900/50 rounded-2xl p-4 mx-4 my-2 border border-zinc-800">
            {/* Question */}
            <Text className="text-white font-bold text-lg mb-4">{poll.question}</Text>

            {/* Options */}
            <View className="space-y-2">
                {poll.options.map((option, index) => {
                    const percentage = calculatePercentage(index);
                    const isSelected = selectedOption === index;
                    const hasVoted = selectedOption !== null;

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleVote(index)}
                            disabled={voting || hasVoted}
                            className={`relative overflow-hidden rounded-xl p-4 border ${isSelected
                                    ? 'border-gold bg-gold/10'
                                    : 'border-zinc-700 bg-zinc-800/30'
                                }`}
                        >
                            {/* Progress bar background */}
                            {hasVoted && (
                                <View
                                    className="absolute left-0 top-0 bottom-0 bg-gold/20"
                                    style={{ width: `${percentage}%` }}
                                />
                            )}

                            {/* Content */}
                            <View className="flex-row justify-between items-center relative">
                                <Text
                                    className={`font-medium ${isSelected ? 'text-gold' : 'text-white'
                                        }`}
                                >
                                    {option.text}
                                </Text>

                                {hasVoted && (
                                    <Text
                                        className={`font-bold ${isSelected ? 'text-gold' : 'text-zinc-400'
                                            }`}
                                    >
                                        {percentage}%
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Total votes */}
            <Text className="text-zinc-500 text-sm mt-3 text-center">
                {poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'}
            </Text>

            {/* Loading spinner */}
            {voting && (
                <View className="absolute inset-0 bg-black/50 rounded-2xl items-center justify-center">
                    <ActivityIndicator size="large" color="#f59e0b" />
                </View>
            )}
        </View>
    );
}
