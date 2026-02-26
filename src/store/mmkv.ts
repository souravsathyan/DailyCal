import { createMMKV, MMKV } from "react-native-mmkv";

export const storage = createMMKV({
  id: "dailycal-storage",
  encryptionKey:'orionSaga1234567890'
});
