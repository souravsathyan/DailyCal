import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import {
  TextField,
  Label,
  Input,
  Description,
  FieldError,
} from "heroui-native";

interface ControlledInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate"
  >;
}

export const ControlledInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
  rules,
}: ControlledInputProps<T>) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = secureTextEntry === true;

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <TextField isInvalid={!!error} className="mb-4 ">
          <Label>
            <Label.Text className="text-sm">{label}</Label.Text>
          </Label>
          <View className="relative">
            <Input
              placeholder={placeholder}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={isPasswordField && !isPasswordVisible}
              autoCapitalize={autoCapitalize}
              keyboardType={keyboardType}
              className={isPasswordField ? "pr-12 border" : "border"}
            />
            {isPasswordField && (
              <TouchableOpacity
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            )}
          </View>
          {description && !error && <Description>{description}</Description>}
          {error && <FieldError>{error.message as string}</FieldError>}
        </TextField>
      )}
    />
  );
};
