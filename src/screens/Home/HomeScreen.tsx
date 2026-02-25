import { Button, Input } from "heroui-native";
import { View, Text, StyleSheet } from "react-native";
import { FieldError, Label, TextField } from "heroui-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Button
        onPress={() => console.log("Pressed!")}
        size="md"
        variant="danger"
      >
        <Button.Label>Get Started</Button.Label>
      </Button>

      <Button>
        {/* <Icon name="add" size={20} /> */}
        <Button.Label>Add Item</Button.Label>
      </Button>

      <TextField isRequired isInvalid={true}>
        <Label>Email</Label>
        <Input placeholder="Enter your email" />
        <FieldError>Please enter a valid email address</FieldError>
      </TextField>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
