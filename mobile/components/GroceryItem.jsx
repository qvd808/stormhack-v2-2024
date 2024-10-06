import React from "react";
import { View, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { styled } from "nativewind";

const StyledPicker = styled(Picker);

const GroceryItem = ({
  item,
  index,
  tempData,
  setTempData,
  validCategories,
  setIsValid,
}) => {
  return (
    <View className="bg-gray-700 rounded-xl p-4 mb-4">
      <TextInput
        className="bg-gray-600 text-gray-100 rounded-lg p-3 mb-3 text-base"
        placeholder="Enter name"
        placeholderTextColor="#9CA3AF"
        defaultValue={item.name}
        onChangeText={(text) => {
          const updatedData = [...tempData];
          updatedData[index].name = text;
        }}
        onBlur={() => {
            const updatedData = [...tempData];
            setTempData(updatedData);
        }}
      />
      <TextInput
        className="bg-gray-600 text-gray-100 rounded-lg p-3 mb-3 text-base"
        placeholder="Enter price"
        placeholderTextColor="#9CA3AF"
        defaultValue={item.price.toString()}
        onChangeText={(text) => {
          const price = parseFloat(text);
          const updatedData = [...tempData];
          updatedData[index].price = price;
        }}
        onBlur={() => {
          const price = parseFloat(item.price);
          if (!isNaN(price) && price > 0) {
            setIsValid(true);
          } else {
            setIsValid(false);
          }
          const updatedData = [...tempData];
          setTempData(updatedData);
        }}
        keyboardType="numeric"
      />
      <StyledPicker
        selectedValue={item.category}
        className="bg-gray-600 text-gray-100 rounded-lg mb-3"
        onValueChange={(itemValue) => {
          const updatedData = [...tempData];
          updatedData[index].category = itemValue;
        }}
        onBlur={() => {
          const updatedData = [...tempData];
          setTempData(updatedData);
        }}
      >
        <Picker.Item
          label="Select a category"
          value=""
          className="text-red-500"
        />
        {validCategories.map((category, index) => (
          <Picker.Item
            key={index}
            label={category}
            value={category}
            color="#FFFFF"
          />
        ))}
      </StyledPicker>
    </View>
  );
};

export default GroceryItem;
