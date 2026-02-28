import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";
import { BottomSheet, Button } from "heroui-native";
import { ControlledInput } from "@/components/forms/ControlledInput";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppToast } from "@/hooks/useAppToast";
import { Ionicons } from "@expo/vector-icons";

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

export default function SignupScreen() {
  const router = useRouter();
  const { showError } = useAppToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const signupWithEmail = useAuthStore((state) => state.signupWithEmail);
  const isLoading = useAuthStore((state) => state.isLoading);

  const { control, handleSubmit } = useForm<SignUpFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      const { error } = await signupWithEmail({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      setIsSheetOpen(true);
    } catch (error: any) {
      showError("Error", error.message || "Signup failed");
    } finally {
      Keyboard.dismiss();
    }
  };

  const handleContinue = () => {
    setIsSheetOpen(false);
    router.replace("/(auth)/login");
  };

  return (
    <>
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
            className="mt-6 bg-accent w-full "
            onPress={handleSubmit(onSubmit)}
            isDisabled={isLoading}
            onLongPress={() => setIsSheetOpen(true)}
            size="lg"
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-poppins-600 text-lg">
                Sign Up
              </Text>
            )}
          </Button>

          <View className="flex-row justify-center mt-8 mb-10">
            <Text className="text-gray-500 font-poppins-400">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
              <Text className="text-blue-600 font-poppins-600">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Email Verification Bottom Sheet */}
      <BottomSheet isOpen={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content snapPoints={["40%"]} style={styles.sheetContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={48} color="#3b82f6" />
            </View>

            <BottomSheet.Title style={styles.sheetTitle}>
              Check Your Email
            </BottomSheet.Title>

            <BottomSheet.Description style={styles.sheetDescription}>
              We sent a verification link to your inbox. Please verify your
              email to continue.
            </BottomSheet.Description>

            <Button className="mt-6 bg-accent w-full " onPress={handleContinue}>
              <Text className="text-white font-poppins-600 text-lg">
                Continue to Login
              </Text>
            </Button>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    padding: 24,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  sheetDescription: {
    textAlign: "center",
    fontSize: 15,
    color: "#64748b",
    lineHeight: 22,
  },
});
