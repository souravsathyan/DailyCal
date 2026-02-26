import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "heroui-native";
import { View, Text, StyleSheet } from "react-native";

export default function ProfileScreen() {
  const { logout, isLoading } = useAuthStore();
  return (
    <View style={styles.container}>
      <Button
        className="w-11/12 rounded-xl  bg-red-400"
        onPress={logout}
        isDisabled={isLoading}
      >
        <Text className="text-white font-poppins-600 text-lg ">
          {isLoading ? "Logging out..." : "Logout"}
        </Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
