import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import type { CommentType } from '@packages/schemas';

interface CommentInputProps {
    onSubmit: (text: string, type: CommentType) => Promise<void>;
    placeholder?: string;
}

export default function CommentInput({ onSubmit, placeholder = 'Add a comment...' }: CommentInputProps) {
    const [text, setText] = useState('');
    const [type, setType] = useState<CommentType>('hype');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!text.trim() || submitting) return;

        setSubmitting(true);
        try {
            await onSubmit(text.trim(), type);
            setText('');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View className="border-t border-zinc-800 p-4 bg-zinc-900">
            {/* Type Selector */}
            <View className="flex-row mb-3 gap-2">
                <TouchableOpacity
                    onPress={() => setType('hype')}
                    className={`flex-1 py-2 rounded-lg border ${type === 'hype'
                            ? 'bg-gold/20 border-gold'
                            : 'bg-zinc-800/50 border-zinc-700'
                        }`}
                >
                    <Text
                        className={`text-center font-semibold ${type === 'hype' ? 'text-gold' : 'text-zinc-400'
                            }`}
                    >
                        🔥 Hype
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setType('critique')}
                    className={`flex-1 py-2 rounded-lg border ${type === 'critique'
                            ? 'bg-purple-500/20 border-purple-500'
                            : 'bg-zinc-800/50 border-zinc-700'
                        }`}
                >
                    <Text
                        className={`text-center font-semibold ${type === 'critique' ? 'text-purple-400' : 'text-zinc-400'
                            }`}
                    >
                        💡 Critique
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Input Row */}
            <View className="flex-row items-end gap-2">
                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder={placeholder}
                    placeholderTextColor="#71717a"
                    className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-xl border border-zinc-700"
                    maxLength={500}
                    multiline
                    style={{ maxHeight: 100 }}
                />

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!text.trim() || submitting}
                    className={`px-4 py-3 rounded-xl ${text.trim() && !submitting ? 'bg-gold' : 'bg-zinc-700'
                        }`}
                >
                    <Text
                        className={`font-bold ${text.trim() && !submitting ? 'text-black' : 'text-zinc-500'
                            }`}
                    >
                        Post
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Character Count */}
            <Text className="text-zinc-600 text-xs mt-2 text-right">
                {text.length}/500
            </Text>
        </View>
    );
}
