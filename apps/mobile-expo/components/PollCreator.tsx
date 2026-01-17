import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    ScrollView,
} from 'react-native';
import { POLL_TEMPLATES, type PollTemplateKey } from '@packages/domain';
import type { CreatePollInput } from '@packages/schemas';

interface PollCreatorProps {
    visible: boolean;
    onClose: () => void;
    onCreatePoll: (pollData: Omit<CreatePollInput, 'mediaId'>) => void;
}

export default function PollCreator({ visible, onClose, onCreatePoll }: PollCreatorProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<PollTemplateKey | null>(null);
    const [customQuestion, setCustomQuestion] = useState('');
    const [customOptions, setCustomOptions] = useState<string[]>(['', '']);

    const handleSelectTemplate = (template: PollTemplateKey) => {
        setSelectedTemplate(template);
        if (template === 'custom') {
            setCustomQuestion('');
            setCustomOptions(['', '']);
        }
    };

    const handleAddOption = () => {
        if (customOptions.length < 6) {
            setCustomOptions([...customOptions, '']);
        }
    };

    const handleRemoveOption = (index: number) => {
        if (customOptions.length > 2) {
            setCustomOptions(customOptions.filter((_, i) => i !== index));
        }
    };

    const handleUpdateOption = (index: number, value: string) => {
        const updated = [...customOptions];
        updated[index] = value;
        setCustomOptions(updated);
    };

    const handleCreate = () => {
        if (!selectedTemplate) {
            Alert.alert('Select Template', 'Please select a poll template');
            return;
        }

        let question: string;
        let options: string[];

        if (selectedTemplate === 'custom') {
            question = customQuestion.trim();
            options = customOptions.map((o) => o.trim()).filter((o) => o.length > 0);

            if (!question) {
                Alert.alert('Missing Question', 'Please enter a poll question');
                return;
            }
            if (options.length < 2) {
                Alert.alert('Missing Options', 'Please add at least 2 options');
                return;
            }
        } else if (selectedTemplate === 'cast') {
            question = POLL_TEMPLATES[selectedTemplate].question;
            options = customOptions.map((o) => o.trim()).filter((o) => o.length > 0);

            if (options.length < 2) {
                Alert.alert('Missing Options', 'Please add at least 2 cast options');
                return;
            }
        } else {
            const template = POLL_TEMPLATES[selectedTemplate];
            question = template.question;
            options = [...template.options]; // Convert readonly to mutable
        }

        onCreatePoll({
            templateType: selectedTemplate,
            question,
            options,
        });

        // Reset
        setSelectedTemplate(null);
        setCustomQuestion('');
        setCustomOptions(['', '']);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 bg-black/80 justify-end">
                <View className="bg-zinc-900 rounded-t-3xl p-6 max-h-[80%]">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white text-xl font-bold">Add Poll</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text className="text-gold text-lg">✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Template Selection */}
                        <Text className="text-zinc-400 text-sm mb-3">Select Template</Text>
                        <View className="space-y-2 mb-6">
                            {(Object.keys(POLL_TEMPLATES) as PollTemplateKey[]).map((key) => (
                                <TouchableOpacity
                                    key={key}
                                    onPress={() => handleSelectTemplate(key)}
                                    className={`p-4 rounded-xl border ${selectedTemplate === key
                                        ? 'border-gold bg-gold/10'
                                        : 'border-zinc-700 bg-zinc-800/30'
                                        }`}
                                >
                                    <Text
                                        className={`font-medium capitalize ${selectedTemplate === key ? 'text-gold' : 'text-white'
                                            }`}
                                    >
                                        {key === 'sequel'
                                            ? '🎬 Sequel?'
                                            : key === 'cast'
                                                ? '👥 Cast This?'
                                                : key === 'rating'
                                                    ? '⭐ Rate Concept'
                                                    : '✏️ Custom'}
                                    </Text>
                                    {key !== 'custom' && key !== 'cast' && (
                                        <Text className="text-zinc-500 text-sm mt-1">
                                            {POLL_TEMPLATES[key].question}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Custom Question Input */}
                        {selectedTemplate === 'custom' && (
                            <View className="mb-4">
                                <Text className="text-zinc-400 text-sm mb-2">Question</Text>
                                <TextInput
                                    value={customQuestion}
                                    onChangeText={setCustomQuestion}
                                    placeholder="Enter your question..."
                                    placeholderTextColor="#71717a"
                                    className="bg-zinc-800 text-white p-4 rounded-xl border border-zinc-700"
                                    maxLength={200}
                                />
                            </View>
                        )}

                        {/* Custom Options Input */}
                        {(selectedTemplate === 'custom' || selectedTemplate === 'cast') && (
                            <View className="mb-4">
                                <Text className="text-zinc-400 text-sm mb-2">Options</Text>
                                {customOptions.map((option, index) => (
                                    <View key={index} className="flex-row items-center mb-2">
                                        <TextInput
                                            value={option}
                                            onChangeText={(text) => handleUpdateOption(index, text)}
                                            placeholder={`Option ${index + 1}`}
                                            placeholderTextColor="#71717a"
                                            className="flex-1 bg-zinc-800 text-white p-3 rounded-xl border border-zinc-700"
                                            maxLength={100}
                                        />
                                        {customOptions.length > 2 && (
                                            <TouchableOpacity
                                                onPress={() => handleRemoveOption(index)}
                                                className="ml-2 p-2"
                                            >
                                                <Text className="text-red-500">✕</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}
                                {customOptions.length < 6 && (
                                    <TouchableOpacity
                                        onPress={handleAddOption}
                                        className="border border-dashed border-zinc-600 p-3 rounded-xl mt-2"
                                    >
                                        <Text className="text-zinc-500 text-center">
                                            + Add Option
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </ScrollView>

                    {/* Create Button */}
                    <TouchableOpacity
                        onPress={handleCreate}
                        className="bg-gold py-4 rounded-xl mt-4"
                        disabled={!selectedTemplate}
                    >
                        <Text className="text-black font-bold text-center text-lg">
                            Create Poll
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
