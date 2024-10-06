import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import GroceryItem from './GroceryItem';
import {
  Button,
  SafeAreaView,
  Text,
  View,
  FlatList,
  Alert,
  TextInput,
} from "react-native";
import { styled } from "nativewind";
import { getData, storeData } from "./AsyncMethod";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledText = styled(Text);
const StyledButton = styled(Button);
const StyledTextInput = styled(TextInput);
const StyledView = styled(View);

const imageApiKey = process.env["IMAGE_API_KEY"];
const lmlApiKey = process.env["LLM_API_KEY"];
const apiUrl = process.env["API_URL"];

export default function UploadImage() {
  const [image, setImage] = useState(null);
  const [tempData, setTempData] = useState([]);
  const [historyExpenses, setHistoryExpenses] = useState([]);
  const [isValid, setIsValid] = useState(true);

  const validCategories = [
    "Dairy & Eggs",
    "Snacks & Candy",
    "Baked & Bakery",
    "Frozen Food",
    "Meat",
    "Seafood",
    "Pantry",
    "Drinks",
    "Fruits & Vegs",
  ];


  const processImage = async (base64Image) => {
    const requestBody = {
      requests: [
        {
          image: { content: base64Image },
          features: [{ type: "TEXT_DETECTION" }],
        },
      ],
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.responses[0].fullTextAnnotation?.text || "No text found";
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert("Error", "Failed to process image");
      return null;
    }
  };

  const callLanguageModelAPI = async (result) => {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    const headers = {
      Authorization: `Bearer ${lmlApiKey}`,
      "Content-Type": "application/json",
    };

    const data = {
      messages: [
        {
          role: "user",
          content: `
          Parse the following receipt text into a JSON object with this format:
          {
            "items": [
              {
                "name": "",
                "price": ""
              }
            ],
            "total": "",
          }.
          Remove all other text, and only keep the JSON object:\n${result}
        `,
        },
      ],
      model: "llama3-8b-8192",
      response_format: { type: "json_object" },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get the error details
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorData.message}`
        );
      }

      const responseData = await response.json();
      return responseData.choices[0]?.message?.content || "No content found";
    } catch (error) {
      console.error(`Error: ${error.message}`);
      return {
        items: [{ name: "Error", price: "Error" }],
        total: "Error",
      };
    }
  };

  const callLanguageModelAPICategorize = async (result) => {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    const headers = {
      Authorization: `Bearer ${lmlApiKey}`,
      "Content-Type": "application/json",
    };

    const data = {
      messages: [
        {
          role: "system",
          content: `You are a data analyst API capable of categorizing grocery items into predefined categories.
          The available categories are: Dairy & Eggs, Snacks & Candy, Frozen Food, Meat, Seafood,
          Pantry, Drinks, Fruits & Vegs.
          You will be given an array of item names, and you must return an array of JSON objects following the schema below.
          Respond in JSON format.
          Must provided the category, and must be from the list of categories above.
          The JSON schema should include:
          {
          "grocery_category_analysis": [
          {
          "category": "string (Dairy & Eggs, Snacks & Candy, Baked & Bakery, Frozen Food, Meat, Seafood, Pantry, Drinks, Fruits & Vegs)",
          "confidence_score": "number (0-1)"
          }
          ],
          }`,
        },
        {
          role: "user",
          content: `${result}`,
        },
      ],
      model: "llama3-8b-8192",
      response_format: { type: "json_object" },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get the error details
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorData.message}`
        );
      }

      const responseData = await response.json();
      return responseData.choices[0]?.message?.content || "No content found";
    } catch (error) {
      console.error(`Error: ${error.message}`);
      return {
        items: [{ name: "Error", price: "Error" }],
        total: "Error",
      };
    }
  };

  const getCategoriesWithRetry = async (names, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const categories = await callLanguageModelAPICategorize(names);
      if (!categories) continue;

      const loadedCategories = JSON.parse(categories);
      const categoryAnalysis = loadedCategories.grocery_category_analysis;

      // Check if we have enough categories
      if (categoryAnalysis.length >= names.length / 2) {
        return loadedCategories;
      }

      console.log(`Attempt ${attempt}: Not enough categories, retrying...`);
    }

    // If we've exhausted all retries, return a default category for each item
    return {
      grocery_category_analysis: names.map(() => ({
        category: "Unknown",
        confidence_score: 0,
      })),
    };
  };

  // Modify the part where you process the chat response
  const pickImageGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      const process_image = await processImage(result.assets[0].base64);
      if (process_image) {
        const chatResponse = await callLanguageModelAPI(process_image);
        if (chatResponse) {
          const chatData = JSON.parse(chatResponse);
          const names = chatData.items.map((item) => item.name);

          // Use the new retry function

          const loadedCategories = await getCategoriesWithRetry(names);

          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().split("T")[0];

          chatData.items.forEach((item, index) => {
            item.date = formattedDate;
            item.price = String(item.price).replace(/[^0-9.]/g, "");
            item.category =
              index < loadedCategories.grocery_category_analysis.length
                ? loadedCategories.grocery_category_analysis[index].category
                : "Unknown";
          });
          setTempData(chatData.items);
        }
      }
    }
  };

  // Function to capture an image using the camera
  const pickImageCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      const process_image = await processImage(result.assets[0].base64);
      if (process_image) {
        const chatResponse = await callLanguageModelAPI(process_image);
        if (chatResponse) {
          const chatData = JSON.parse(chatResponse);
          const names = chatData.items.map((item) => item.name);

          // Use the new retry function
          const loadedCategories = await getCategoriesWithRetry(names);

          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().split("T")[0];

          chatData.items.forEach((item, index) => {
            item.date = formattedDate;
            item.price = String(item.price).replace(/[^0-9.]/g, "");
            item.category =
              index < loadedCategories.grocery_category_analysis.length
                ? loadedCategories.grocery_category_analysis[index].category
                : "Unknown";
          });

          setTempData(chatData.items);
        }
      }
    }
  };

  // Save parsed data to async storage
  const handleDone = async () => {
    try {
      // Check if any item has category "unknown"
    const hasUnknownCategory = tempData.some(item => item.category === 'Unknown');

    if (hasUnknownCategory) {
      Alert.alert("Validation Error", "Cannot save data with 'unknown' category.");
      return; // Exit the function early
    }
      const processedData = tempData.map((item) => ({
        id: "id-" + Math.random().toString(36),
        date: item.date,
        category: item.category,
        amount: item.price,
        name: item.name,
      }));

      await getData(setHistoryExpenses);
      processedData.push(...historyExpenses);

      await storeData(processedData);
      setTempData([]);
    } catch (error) {
      console.error("Failed to save data:", error);
      Alert.alert("Error", "Failed to save data");
    }
  };

 // Render the table of grocery items
 const renderItem = ({ item, index }) => (
  <GroceryItem
    item={item}
    index={index}
    tempData={tempData}
    setTempData={setTempData}
    validCategories={validCategories}
    setIsValid={setIsValid}
  />
);

  return (
    <StyledSafeAreaView className="flex-1 bg-gray-800 p-4">
      {tempData.length === 0 ? (
        <>
          <StyledView className="mb-4">
            <StyledButton
              title="Pick an image from gallery"
              className="bg-blue-500 rounded-lg p-4 items-center"
              onPress={pickImageGallery}
            >
              <StyledText className="text-gray-100 text-base font-bold">Pick an image from gallery</StyledText>
            </StyledButton>
          </StyledView>
          <StyledView className="mb-4">
            <StyledButton
              title="Pick an image from camera"
              className="bg-blue-500 rounded-lg p-4 items-center"
              onPress={pickImageCamera}
            >
              <StyledText className="text-gray-100 text-base font-bold">Pick an image from camera</StyledText>
            </StyledButton>
          </StyledView>
          <StatusBar style="light" />
        </>
      ) : (
        <>
          <FlatList
            data={tempData}
            keyExtractor={(item) => item.name + item.price}
            renderItem={renderItem}
            contentContainerStyle="flex-grow pb-4"
          />
          <StyledView className="mb-4">
            <StyledButton
              title="Done"
              className={`rounded-lg p-4 items-center ${isValid ? 'bg-blue-500' : 'bg-gray-500'}`}
              onPress={handleDone}
              disabled={!isValid}
            >
              <StyledText className="text-gray-100 text-base font-bold">Done</StyledText>
            </StyledButton>
          </StyledView>
        </>
      )}
    </StyledSafeAreaView>
  );
}