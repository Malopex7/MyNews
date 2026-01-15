import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { Input, Button, Card } from '../../components';
import { useAuth } from '../../hooks';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function RegisterScreen() {
    const { register, isSubmitting, error, clearError } = useAuth();
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});

    const validate = (): boolean => {
        const newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};

        if (!name.trim()) newErrors.name = 'Name is required';
        else if (name.length < 2) newErrors.name = 'Name must be at least 2 characters';

        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';

        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        clearError();
        if (!validate()) return;

        const success = await register({ email, password, name });
        if (success) {
            // Navigation is handled by the _layout or useAuth logic usually, 
            // but just in case we need manual intervention or to show a success message first.
            // For now, assume auth state change triggers navigation in _layout.
        }
    };

    return (
        <StyledKeyboardAvoidingView
            className="flex-1 bg-background"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar style="light" />
            <StyledScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                keyboardShouldPersistTaps="handled"
            >
                <StyledView className="p-6">
                    {/* Header */}
                    <StyledView className="items-center mb-6">
                        <StyledText className="text-3xl font-bold text-primary mb-2 font-display">
                            Join FanFlick
                        </StyledText>
                        <StyledText className="text-text-secondary text-center">
                            Create your account to start your journey
                        </StyledText>
                    </StyledView>

                    {/* Register Form */}
                    <Card variant="elevated" className="mb-6 bg-surface border-surface-highlight">
                        {error && (
                            <StyledView className="bg-red-900/20 p-3 rounded-lg mb-4 border border-red-900/50">
                                <StyledText className="text-red-400 text-center">
                                    {error}
                                </StyledText>
                            </StyledView>
                        )}

                        <Input
                            label="Full Name"
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            autoCapitalize="words"
                            error={errors.name}
                            className="bg-surface-highlight text-text-primary border-surface-highlight"
                        />

                        <Input
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={errors.email}
                            className="bg-surface-highlight text-text-primary border-surface-highlight"
                        />

                        <Input
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Create a password (min 8 chars)"
                            secureTextEntry
                            error={errors.password}
                            className="bg-surface-highlight text-text-primary border-surface-highlight"
                        />

                        <Input
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm your password"
                            secureTextEntry
                            error={errors.confirmPassword}
                            className="bg-surface-highlight text-text-primary border-surface-highlight"
                        />

                        <Button
                            title="Create Account"
                            onPress={handleRegister}
                            loading={isSubmitting}
                            size="lg"
                            className="bg-primary mt-2"
                        />
                    </Card>

                    {/* Social Login Placeholders */}
                    <StyledView className="mb-6">
                        <StyledView className="flex-row items-center mb-4">
                            <StyledView className="flex-1 h-px bg-surface-highlight" />
                            <StyledText className="mx-4 text-text-secondary text-sm">Or sign up with</StyledText>
                            <StyledView className="flex-1 h-px bg-surface-highlight" />
                        </StyledView>

                        <StyledView className="flex-row gap-4">
                            <StyledTouchableOpacity className="flex-1 bg-surface-highlight p-3 rounded-lg items-center border border-surface-highlight/50 flex-row justify-center gap-2">
                                <Ionicons name="logo-google" size={20} color="white" />
                                <StyledText className="text-text-primary font-semibold">Google</StyledText>
                            </StyledTouchableOpacity>
                            <StyledTouchableOpacity className="flex-1 bg-surface-highlight p-3 rounded-lg items-center border border-surface-highlight/50 flex-row justify-center gap-2">
                                <Ionicons name="logo-apple" size={20} color="white" />
                                <StyledText className="text-text-primary font-semibold">Apple</StyledText>
                            </StyledTouchableOpacity>
                        </StyledView>
                    </StyledView>

                    {/* Login Link */}
                    <StyledView className="flex-row justify-center pb-8">
                        <StyledText className="text-text-secondary">
                            Already have an account?{' '}
                        </StyledText>
                        <StyledText
                            className="text-primary font-semibold"
                            onPress={() => router.back()}
                        >
                            Sign In
                        </StyledText>
                    </StyledView>
                </StyledView>
            </StyledScrollView>
        </StyledKeyboardAvoidingView>
    );
}
