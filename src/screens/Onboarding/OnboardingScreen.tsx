import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { StepIndicator } from "@/components/StepIndicator";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { useAppToast } from "@/hooks/useAppToast";
import { RulerPicker } from "react-native-ruler-picker";
import { useAuthStore } from "@/store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { DatePicker } from "react-native-wheel-pick";
import { ProfileService } from "@/server/profileService";

// Reanimated items
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const ONBOARDING_STEPS = [
  "GET_STARTED",
  "HEIGHT_WEIGHT",
  "AGE",
  "GENDER",
  "ACTIVITY",
];

const TOTAL_STEPS = ONBOARDING_STEPS.length;

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const {
    height,
    setHeight,
    weight,
    setWeight,
    age,
    setAge,
    gender,
    setGender,
    activityLevel,
    setActivityLevel,
  } = useOnboardingStore();

  const { user, setIsOnboarded } = useAuthStore();
  const toast = useAppToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Footer button animation shared values
  const buttonWidth = useSharedValue(width - 48);
  const arrowOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(1);

  useEffect(() => {
    const isFirst = currentStep === 0;
    const isLast = currentStep === TOTAL_STEPS - 1;

    if (isFirst || isLast) {
      buttonWidth.value = withSpring(width - 48, {
        damping: 42,
        stiffness: 200,
      });
      arrowOpacity.value = withTiming(0, { duration: 180 });
      textOpacity.value = withTiming(1, { duration: 300 });
    } else {
      buttonWidth.value = withSpring(60, { damping: 42, stiffness: 200 });
      arrowOpacity.value = withTiming(1, { duration: 300 });
      textOpacity.value = withTiming(0, { duration: 180 });
    }
  }, [currentStep]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    width: buttonWidth.value,
  }));

  const animatedArrowStyle = useAnimatedStyle(() => ({
    opacity: arrowOpacity.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const goToNextStep = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      listRef.current?.scrollToIndex({
        index: currentStep + 1,
        animated: true,
      });
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      listRef.current?.scrollToIndex({
        index: currentStep - 1,
        animated: true,
      });
    }
  };

  const onMomentumScrollEnd = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(x / width);
    if (newIndex !== currentStep) {
      setCurrentStep(newIndex);
    }
  };

  const handleFinish = async () => {
    if (!activityLevel || !height || !weight || !age || !gender || !user)
      return;

    setIsSubmitting(true);
    try {
      await ProfileService.saveProfile({
        userId: user.id,
        height,
        weight,
        age,
        gender,
        activityLevel,
      });

      toast.showSuccess("Success!", "Your profile has been saved.");
      setIsOnboarded(true);
      // _layout.tsx handles redirect to (tabs) automatically
    } catch (error: any) {
      console.log(error);
      toast.showError("Error", error.message || "Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Step Screens
  // ---------------------------------------------------------------------------

  const renderGetStarted = () => (
    <View style={{ width }} className="flex-1 px-6 pt-10 pb-6 bg-surface">
      <View className="items-center">
        <Text className="font-poppinsBold text-3xl text-center mb-4 text-foreground">
          Welcome to DailyCal
        </Text>
        <Text className="font-poppinsRegular text-muted text-center mb-8">
          Tell us a bit about yourself so we can personalize your experience.
        </Text>
      </View>
      <View className="flex-1 justify-center items-center">
        <View className="w-64 h-64 bg-accent/10 rounded-full items-center justify-center">
          <Text className="font-poppinsMedium text-accent">Illustration</Text>
        </View>
      </View>
    </View>
  );

  const renderHeightAndWeight = () => (
    <View style={{ width }} className="flex-1 px-6 pt-10 pb-6 bg-surface">
      <View className="items-center mb-4">
        <Text className="font-poppinsBold text-3xl text-center text-foreground">
          Your Body Measurements
        </Text>
        <Text className="font-poppinsRegular text-muted text-center mt-2">
          Scroll the ruler to set your height and weight.
        </Text>
      </View>

      <View className="flex-1 justify-center">
        <View className="flex-row items-center mb-2">
          <View className="w-1 h-5 bg-accent rounded-full mr-2" />
          <Text className="font-poppinsSemiBold text-lg text-foreground">
            Height
          </Text>
        </View>
        <View
          onTouchStart={() =>
            listRef.current?.setNativeProps({ scrollEnabled: false })
          }
          onTouchEnd={() =>
            listRef.current?.setNativeProps({ scrollEnabled: true })
          }
          onTouchCancel={() =>
            listRef.current?.setNativeProps({ scrollEnabled: true })
          }
        >
          <RulerPicker
            min={100}
            max={250}
            step={1}
            fractionDigits={0}
            initialValue={height || 170}
            onValueChangeEnd={(val) => setHeight(Number(val))}
            unit="cm"
            width={width - 48}
            height={200}
            indicatorColor="#3b82f6"
            valueTextStyle={{ fontWeight: "700" }}
            unitTextStyle={{ fontWeight: "600" }}
          />
        </View>
      </View>

      <View className="h-px bg-border my-4" />

      <View className="flex-1 justify-center">
        <View className="flex-row items-center mb-2">
          <View className="w-1 h-5 bg-accent rounded-full mr-2" />
          <Text className="font-poppinsSemiBold text-lg text-foreground">
            Weight
          </Text>
        </View>
        <View
          onTouchStart={() =>
            listRef.current?.setNativeProps({ scrollEnabled: false })
          }
          onTouchEnd={() =>
            listRef.current?.setNativeProps({ scrollEnabled: true })
          }
          onTouchCancel={() =>
            listRef.current?.setNativeProps({ scrollEnabled: true })
          }
        >
          <RulerPicker
            min={30}
            max={200}
            step={1}
            fractionDigits={0}
            initialValue={weight || 70}
            onValueChangeEnd={(val) => setWeight(Number(val))}
            unit="kg"
            width={width - 48}
            height={200}
            indicatorColor="#3b82f6"
            valueTextStyle={{ fontWeight: "700" }}
            unitTextStyle={{ fontWeight: "600" }}
          />
        </View>
      </View>
    </View>
  );

  const renderAge = () => {
    const defaultDate = new Date(
      new Date().setFullYear(new Date().getFullYear() - (age || 25)),
    );

    const handleDateChange = (selectedDate: Date) => {
      const today = new Date();
      let calculatedAge = today.getFullYear() - selectedDate.getFullYear();
      const m = today.getMonth() - selectedDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < selectedDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    };

    return (
      <View style={{ width }} className="flex-1 px-6 pt-10 pb-6 bg-surface">
        <View>
          <Text className="font-poppinsBold text-3xl text-center mb-2 text-foreground">
            What is Your Date of Birth?
          </Text>
          <Text className="font-poppinsRegular text-muted text-center mb-8">
            This helps us calculate your daily caloric needs.
          </Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <DatePicker
            style={{ backgroundColor: "transparent", height: 200, width: 320 }}
            textSize={18}
            date={defaultDate}
            onDateChange={handleDateChange}
            textColor="#1e293b"
            mode="date"
            maximumDate={new Date()}
            minimumDate={new Date(1924, 0, 1)}
          />
          <View
            pointerEvents="none"
            className="absolute w-full h-10 border-y-2 border-accent/20 bg-accent/10 rounded-xl top-1/2 -mt-5"
          />
        </View>
      </View>
    );
  };

  const renderGender = () => {
    const genderOptions: {
      id: "male" | "female" | "other";
      label: string;
      icon: keyof typeof Ionicons.glyphMap;
      color: string;
      bgLight: string;
    }[] = [
      {
        id: "male",
        label: "Male",
        icon: "male-outline",
        color: "#3B82F6",
        bgLight: "#DBEAFE",
      },
      {
        id: "female",
        label: "Female",
        icon: "female-outline",
        color: "#EC4899",
        bgLight: "#FCE7F3",
      },
      {
        id: "other",
        label: "Other",
        icon: "person-outline",
        color: "#F97316",
        bgLight: "#FFEDD5",
      },
    ];

    return (
      <View style={{ width }} className="flex-1 px-6 pt-10 pb-6 bg-surface">
        <View>
          <Text className="font-poppinsBold text-3xl text-center mb-2 text-foreground">
            What is Your Gender?
          </Text>
          <Text className="font-poppinsRegular text-muted text-center mb-8">
            To give you a better experience we need to know your gender.
          </Text>
        </View>
        <View className="flex-1 justify-center gap-4">
          {genderOptions.map((option) => {
            const isSelected = gender === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                activeOpacity={0.7}
                onPress={() => setGender(option.id)}
                style={{
                  borderColor: isSelected ? option.color : "#e5e7eb",
                  backgroundColor: isSelected ? option.bgLight : "transparent",
                  borderWidth: 1.5,
                  borderRadius: 16,
                  padding: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isSelected ? option.color : option.bgLight,
                  }}
                >
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={isSelected ? "white" : option.color}
                  />
                </View>
                <Text
                  style={{ color: option.color }}
                  className="ml-4 font-poppinsMedium text-lg"
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderActivity = () => {
    const activityOptions: {
      id: "low" | "medium" | "high";
      label: string;
      description: string;
      icon: keyof typeof Ionicons.glyphMap;
      color: string;
      bgLight: string;
    }[] = [
      {
        id: "low",
        label: "Beginner",
        description: "Light walking, mostly sitting.",
        icon: "walk-outline",
        color: "#22C55E",
        bgLight: "#DCFCE7",
      },
      {
        id: "medium",
        label: "Intermediate",
        description: "Exercise 2-3 times a week.",
        icon: "bicycle-outline",
        color: "#A855F7",
        bgLight: "#F3E8FF",
      },
      {
        id: "high",
        label: "Advanced",
        description: "Exercise 4+ times a week.",
        icon: "barbell-outline",
        color: "#EF4444",
        bgLight: "#FEE2E2",
      },
    ];

    return (
      <View style={{ width }} className="flex-1 px-6 pt-10 pb-6 bg-surface">
        <View>
          <Text className="font-poppinsBold text-3xl text-center mb-2 text-foreground">
            Physical Activity Level
          </Text>
          <Text className="font-poppinsRegular text-muted text-center mb-8">
            Choose your regular activity level so we can modify your plan.
          </Text>
        </View>
        <View className="flex-1 justify-center gap-4">
          {activityOptions.map((option) => {
            const isSelected = activityLevel === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                activeOpacity={0.7}
                onPress={() => setActivityLevel(option.id)}
                style={{
                  borderColor: isSelected ? option.color : "#e5e7eb",
                  backgroundColor: isSelected ? option.bgLight : "transparent",
                  borderWidth: 1.5,
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isSelected
                        ? option.color
                        : option.bgLight,
                    }}
                  >
                    <Ionicons
                      name={option.icon}
                      size={24}
                      color={isSelected ? "white" : option.color}
                    />
                  </View>
                  <View className="flex-1 ml-4 justify-center">
                    <Text
                      style={{ color: option.color }}
                      className="font-poppinsSemiBold text-lg"
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={{ color: option.color, opacity: 0.75 }}
                      className="font-poppinsRegular text-sm mt-1"
                    >
                      {option.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: { item: string }) => {
    switch (item) {
      case "GET_STARTED":
        return renderGetStarted();
      case "HEIGHT_WEIGHT":
        return renderHeightAndWeight();
      case "AGE":
        return renderAge();
      case "GENDER":
        return renderGender();
      case "ACTIVITY":
        return renderActivity();
      default:
        return null;
    }
  };

  const isLastStep = currentStep === TOTAL_STEPS - 1;
  const isButtonDisabled = isSubmitting || (isLastStep && !activityLevel);
  const handleFooterPress = isLastStep ? handleFinish : goToNextStep;

  return (
    <View className="flex-1 bg-background">
      <FlatList
        ref={listRef}
        data={ONBOARDING_STEPS}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={TOTAL_STEPS}
      />

      {/* Fixed Footer */}
      <View className="px-6 pb-10 pt-2 bg-surface">
        <StepIndicator totalSteps={TOTAL_STEPS} currentStep={currentStep} />

        <View className="flex-row justify-end mt-4">
          <Animated.View style={[styles.footerButton, animatedButtonStyle]}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleFooterPress}
              disabled={isButtonDisabled}
              style={styles.footerButtonInner}
              className="bg-accent"
            >
              <Animated.View
                style={[styles.absoluteCenter, animatedArrowStyle]}
              >
                <Ionicons name="arrow-forward" size={24} color="white" />
              </Animated.View>

              <Animated.View style={animatedTextStyle}>
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-accent-foreground font-poppinsSemiBold text-lg">
                    {currentStep === 0 ? "Get Started" : "Continue"}
                  </Text>
                )}
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerButton: {
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
  },
  footerButtonInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  absoluteCenter: {
    position: "absolute",
  },
});
