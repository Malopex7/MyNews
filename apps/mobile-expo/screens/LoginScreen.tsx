import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { Input, Button, Card } from '../components';
import { useAuth } from '../hooks';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView);
const StyledScrollView = styled(ScrollView);

interface Props {
    onNavigateToRegister?: () => void;
}

export const LoginScreen: React.FC<Props> = ({ onNavigateToRegister }) => {
    const { login, isSubmitting, error, clearError } = useAuth();
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
            className="flex-1 bg-secondary-50 dark:bg-secondary-900"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar style="auto" />
            <StyledScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                keyboardShouldPersistTaps="handled"
            >
                <StyledView className="p-6">
                    {/* Header */}
                    <StyledView className="items-center mb-8">
                        <StyledText className="text-3xl font-bold text-primary-600 mb-2">
                            Welcome Back
                        </StyledText>
                        <StyledText className="text-secondary-500 text-center">
                            Sign in to continue to your account
                        </StyledText>
                    </StyledView>

                    {/* Login Form */}
                    <Card variant="elevated" className="mb-6">
                        {error && (
                            <StyledView className="bg-red-100 dark:bg-red-900 p-3 rounded-lg mb-4">
                                <StyledText className="text-red-600 dark:text-red-200 text-center">
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
                        />

                        <Input
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            secureTextEntry
                            error={errors.password}
                        />

                        <Button
                            title="Sign In"
                            onPress={handleLogin}
                            loading={isSubmitting}
                            size="lg"
                        />
                    </Card>

                    {/* Register Link */}
                    <StyledView className="flex-row justify-center">
                        <StyledText className="text-secondary-500">
                            Don't have an account?{' '}
                        </StyledText>
                        <StyledText
                            className="text-primary-600 font-semibold"
                            onPress={onNavigateToRegister}
                        >
                            Sign Up
                        </StyledText>
                    </StyledView>
                </StyledView>
            </StyledScrollView>
        </StyledKeyboardAvoidingView>
    );
};
