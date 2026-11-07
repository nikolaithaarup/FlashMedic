import AsyncStorage from "@react-native-async-storage/async-storage";

export const appStorage = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
  setItems: (entries: readonly (readonly [string, string])[]) =>
    AsyncStorage.multiSet(
      entries.map(([key, value]) => [key, value] as [string, string]),
    ),
  removeItem: (key: string) => AsyncStorage.removeItem(key),
  getAllKeys: () => AsyncStorage.getAllKeys(),
};
