import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { Input, Button, Card } from '../../components';
import { useAuth } from '../../hooks';
import { useRouter } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);
const StyledScrollView = styled(ScrollView);

export default function LoginScreen() {
    const { login, isSubmitting, error, clearError } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = (): boolean => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        clearError();
        if (!validate()) return;

        await login({ email, password });
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
                    <StyledView className="items-center mb-8">
                        <StyledText className="text-3xl font-bold text-primary mb-2">
                            Welcome Back
                        </StyledText>
                        <StyledText className="text-text-secondary text-center">
                            Sign in to continue to FanFlick
                        </StyledText>
                    </StyledView>

                    {/* Login Form */}
                    <Card variant="elevated" className="mb-6 bg-surface border-surface-highlight">
                        {error && (
                            <StyledView className="bg-red-900/20 p-3 rounded-lg mb-4 border border-red-900/50">
                                <StyledText className="text-red-400 text-center">
                                    {error}
                                </StyledText>
                            </StyledView>
                        )}

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
                            placeholder="Enter your password"
                            secureTextEntry
                            error={errors.password}
                            className="bg-surface-highlight text-text-primary border-surface-highlight"
                        />

                        <Button
                            title="Sign In"
                            onPress={handleLogin}
                            loading={isSubmitting}
                            size="lg"
                            className="bg-primary"
                        />
                    </Card>

                    {/* Register Link */}
                    <StyledView className="flex-row justify-center">
                        <StyledText className="text-text-secondary">
                            Don't have an account?{' '}
                        </StyledText>
                        <StyledText
                            className="text-primary font-semibold"
                            onPress={() => router.push('/(auth)/register')}
                        >
                            Sign Up
                        </StyledText>
                    </StyledView>
                </StyledView>
            </StyledScrollView>
        </StyledKeyboardAvoidingView>
    );
}
