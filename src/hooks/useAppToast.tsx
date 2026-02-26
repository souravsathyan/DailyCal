import React from "react";
import { useToast as useHeroToast, Toast } from "heroui-native";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const useAppToast = () => {
  const { toast } = useHeroToast();

  const showSuccess = (label: string, description?: string) => {
    toast.show({
      component: (props: any) => (
        <Toast
          className="bg-slate-800 flex-row items-center border-0 p-4 rounded-xl shadow-lg m-2 w-auto"
          {...props}
        >
          <Ionicons name="checkmark-circle-outline" size={24} color="#4ade80" />
          <View className="ml-3 flex-1">
            <Toast.Title className="text-white font-poppins-600 text-base">
              {label}
            </Toast.Title>
            {description && (
              <Toast.Description className="text-slate-300 font-poppins-400 mt-0.5">
                {description}
              </Toast.Description>
            )}
          </View>
        </Toast>
      ),
    });
  };

  const showError = (label: string, description?: string) => {
    toast.show({
      component: (props: any) => (
        <Toast
          className="bg-slate-800 flex-row items-center border-0 p-4 rounded-xl shadow-lg m-2 w-auto"
          {...props}
        >
          <Ionicons name="close-circle-outline" size={24} color="#f87171" />
          <View className="ml-3 flex-1">
            <Toast.Title className="text-white font-poppins-600 text-base">
              {label}
            </Toast.Title>
            {description && (
              <Toast.Description className="text-slate-300 font-poppins-400 mt-0.5">
                {description}
              </Toast.Description>
            )}
          </View>
        </Toast>
      ),
    });
  };

  const showInfo = (label: string, description?: string) => {
    toast.show({
      component: (props: any) => (
        <Toast
          className="bg-slate-800 flex-row items-center border-0 p-4 rounded-xl shadow-lg m-2 w-auto"
          {...props}
        >
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#60a5fa"
          />
          <View className="ml-3 flex-1">
            <Toast.Title className="text-white font-poppins-600 text-base">
              {label}
            </Toast.Title>
            {description && (
              <Toast.Description className="text-slate-300 font-poppins-400 mt-0.5">
                {description}
              </Toast.Description>
            )}
          </View>
        </Toast>
      ),
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
  };
};
