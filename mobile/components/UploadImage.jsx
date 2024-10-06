import React, { useState } from 'react';
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { Button, SafeAreaView, Text, View } from "react-native";
import { styled } from 'nativewind';

const StyledSafeAreaView = styled(SafeAreaView);
const StyledText = styled(Text);
const StyledButton = styled(Button);


// Camera Screen - Placeholder for camera functionality
export default function UploadImage() {
    const [image, setImage] = useState(null); 
    const [extractedText, setExtractedText] = useState(""); 

    // Function to pick an image from the gallery
    const pickImageGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            allowsMultipleSelection: false,
        });

        if (!result.canceled) {
            performOCR(result.assets[0]); 
            setImage(result.assets[0].uri); 
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
            performOCR(result.assets[0]); 
            setImage(result.assets[0].uri);
        }
    };

    // Function to perform OCR on an image and extract text
    const performOCR = (file) => {
        let myHeaders = new Headers();
        myHeaders.append("apikey", "YOUR_API_KEY"); 
        myHeaders.append("Content-Type", "multipart/form-data");

        let raw = file;
        let requestOptions = {
            method: "POST",
            redirect: "follow",
            headers: myHeaders,
            body: raw,
        };

        fetch("https://api.apilayer.com/image_to_text/upload", requestOptions)
            .then((response) => response.json())
            .then((result) => setExtractedText(result["all_text"]))
            .catch((error) => console.log("error", error));
    };

    return (
        <StyledSafeAreaView className="flex-1 justify-center items-center p-4">
            <View className="w-full mb-4">
                <StyledButton 
                    title="Pick an image from gallery" 
                    onPress={pickImageGallery} 
                />
            </View>
            <View className="w-full mb-4">
                <StyledButton 
                    title="Pick an image from camera" 
                    onPress={pickImageCamera} 
                />
            </View>
            <StyledText className="text-base text-center mt-4">{extractedText}</StyledText>
            <StatusBar style="auto" />
        </StyledSafeAreaView>
    );
}
