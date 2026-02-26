import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import { ControlledInput } from "@/components/forms/ControlledInput";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppToast } from "@/hooks/useAppToast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { showSuccess, showError } = useAppToast();
  const isLoading = useAuthStore((state) => state.isLoading);
  const loginWithEmail = useAuthStore((state) => state.loginWithEmail);

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const { error } = await loginWithEmail({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      showSuccess("Success", "Welcome back!");
    } catch (error: any) {
      showError("Error", error.message || "Login failed");
    }
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
      bottomOffset={20}
    >
      <View className="flex-1 p-6 justify-center">
        <Text className="text-4xl font-poppins-600 text-black mb-2">
          Welcome Back,
        </Text>
        <Text className="text-base font-poppins-400 text-gray-500 mb-10">
          Sign in to continue to DailyCal.
        </Text>

        <ControlledInput
          control={control as any}
          name="email"
          label="Email Address"
          placeholder="Enter your email"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <ControlledInput
          control={control as any}
          name="password"
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
        />

        <Button
          className="mt-6 bg-blue-600 w-full rounded-xl py-3"
          onPress={handleSubmit(onSubmit)}
          isDisabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-poppins-600 text-md">Login</Text>
          )}
        </Button>

        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-500 font-poppins-400">
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <Text className="text-blue-600 font-poppins-600">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
