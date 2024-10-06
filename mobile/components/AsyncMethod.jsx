import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const storeData = async (value) => {
  try {
    await AsyncStorage.setItem("expenses", JSON.stringify(value));
    // console.log("Data successfully saved");
    Alert.alert("Success", "Data successfully saved");
  } catch (error) {
    console.error("Failed to save data:", error);
  }
};

export const getData = async (setMethod) => {
  try {
    const value = await AsyncStorage.getItem("expenses");
    if (value !== null) {
    //   console.log("Retrieved data:", value);
      setMethod(JSON.parse(value));
    } else {
      storeData([]);
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};