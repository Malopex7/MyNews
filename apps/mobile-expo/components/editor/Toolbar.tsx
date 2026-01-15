import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export type EditorTool = 'trim' | 'title' | 'audio';

interface ToolbarProps {
    activeTool: EditorTool;
    onSelectTool: (tool: EditorTool) => void;
}

export function Toolbar({ activeTool, onSelectTool }: ToolbarProps) {
    const tools: { id: EditorTool; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
        { id: 'trim', icon: 'cut', label: 'Trim' },
        { id: 'title', icon: 'text', label: 'Title' },
        { id: 'audio', icon: 'musical-notes', label: 'Audio' },
    ];

    return (
        <StyledView className="bg-surface border-t border-gray-800">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 10 }}>
                {tools.map((tool) => (
                    <StyledTouchableOpacity
                        key={tool.id}
                        onPress={() => onSelectTool(tool.id)}
                        className={`mr-6 items-center justify-center p-2 rounded-lg ${activeTool === tool.id ? 'bg-primary/20' : ''
                            }`}
                    >
                        <Ionicons
                            name={tool.icon}
                            size={24}
                            color={activeTool === tool.id ? '#EAB308' : '#A1A1AA'}
                        />
                        <StyledText className={`text-xs mt-1 ${activeTool === tool.id ? 'text-primary font-body-bold' : 'text-text-secondary font-body'
                            }`}>
                            {tool.label}
                        </StyledText>
                    </StyledTouchableOpacity>
                ))}
            </ScrollView>
        </StyledView>
    );
}
