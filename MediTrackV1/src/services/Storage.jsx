import AsyncStorage from "@react-native-async-storage/async-storage";

//Process to save on phone (like token, user info,...)
export const setLocalStorage = async (key, value) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorage = async (key) => {
  const result = await AsyncStorage.getItem(key);
  // return JSON.parse(result);
  return result ? JSON.parse(result) : null;
};

// //Delete user when log out but not dell in asyncStorage
// export const RemoveLocalStorage = async () => {
//   await AsyncStorage.clear();
// };

export const removeLocalStorage = async (key) => {
  await AsyncStorage.removeItem(key);
};
