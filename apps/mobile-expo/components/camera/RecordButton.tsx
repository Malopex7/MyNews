import React from 'react';
import { TouchableOpacity, View, Animated } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface IRecordButtonProps {
    isRecording: boolean;
    onPress: () => void;
    disabled?: boolean;
}

export function RecordButton({ isRecording, onPress, disabled }: IRecordButtonProps) {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        if (isRecording) {
            // Pulsing animation when recording
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.15,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            scaleAnim.stopAnimation();
            scaleAnim.setValue(1);
        }

        return () => {
            scaleAnim.stopAnimation();
        };
    }, [isRecording, scaleAnim]);

    return (
        <StyledTouchableOpacity
            onPress={onPress}
            disabled={disabled}
            className="items-center justify-center"
            activeOpacity={0.7}
        >
            {/* Outer ring */}
            <StyledView className="w-20 h-20 rounded-full border-4 border-white items-center justify-center">
                <Animated.View
                    style={{
                        transform: [{ scale: scaleAnim }],
                    }}
                >
                    {/* Inner circle - changes to square when recording */}
                    <StyledView
                        className={`${isRecording
                                ? 'w-8 h-8 rounded-md bg-accent'
                                : 'w-14 h-14 rounded-full bg-accent'
                            }`}
                    />
                </Animated.View>
            </StyledView>
        </StyledTouchableOpacity>
    );
}
