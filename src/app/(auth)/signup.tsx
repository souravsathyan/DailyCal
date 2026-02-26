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

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signupSchema>;

export default function SignUpScreen() {
  const router = useRouter();
  const { showSuccess, showError } = useAppToast();
  const [isLoading, setIsLoading] = useState(false);
  const signupWithEmail = useAuthStore((state) => state.signupWithEmail);

  const { control, handleSubmit } = useForm<SignUpFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await signupWithEmail({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      showSuccess("Success", "Account created successfully!");
      router.back();
    } catch (error: any) {
      showError("Error", error.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      bottomOffset={20}
    >
      <View className="flex-1 p-6 justify-center mt-10">
        <Text className="text-4xl font-poppins-600 text-black mb-2">
          Create Account,
        </Text>
        <Text className="text-base font-poppins-400 text-gray-500 mb-10">
          Sign up to get started!
        </Text>

        <ControlledInput<SignUpFormValues>
          control={control as any}
          name="email"
          label="Email Address"
          placeholder="Enter your email"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <ControlledInput<SignUpFormValues>
          control={control as any}
          name="password"
          label="Password"
          placeholder="Create a password"
          secureTextEntry
        />

        <ControlledInput<SignUpFormValues>
          control={control as any}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
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
            <Text className="text-white font-poppins-600 text-lg">Sign Up</Text>
          )}
        </Button>

        <View className="flex-row justify-center mt-8 mb-10">
          <Text className="text-gray-500 font-poppins-400">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-600 font-poppins-600">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
