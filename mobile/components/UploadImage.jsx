
import React from 'react';
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import {
    Button,
    SafeAreaView,
    StyleSheet,
    Text,
} from "react-native";

// Camera Screen - Placeholder for camera functionality
export default function UploadImage() {
    const [image, setImage] = useState(null); 
    // State to hold extracted text
    const [extractedText, setExtractedText] = 
        useState(""); 

    // Function to pick an image from the 
    // device's gallery
    const pickImageGallery = async () => {
        let result =
            await ImagePicker.launchImageLibraryAsync({
                mediaTypes:
                    ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                base64: true,
                allowsMultipleSelection: false,
            });
        if (!result.canceled) {
        
            // Perform OCR on the selected image
            performOCR(result.assets[0]); 
            
            // Set the selected image in state
            setImage(result.assets[0].uri); 
        }
    };

    // Function to capture an image using the 
    // device's camera
    const pickImageCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            allowsMultipleSelection: false,
        });
        if (!result.canceled) {
        
               // Perform OCR on the captured image
            // Set the captured image in state
            performOCR(result.assets[0]); 
            setImage(result.assets[0].uri);
        }
    };

    // Function to perform OCR on an image 
    // and extract text
    const performOCR = (file) => {
        let myHeaders = new Headers();
        myHeaders.append(
            "apikey",
            ""  
        );
        myHeaders.append(
            "Content-Type",
            "multipart/form-data"
        );

        let raw = file;
        let requestOptions = {
            method: "POST",
            redirect: "follow",
            headers: myHeaders,
            body: raw,
        };

        // Send a POST request to the OCR API
        fetch(
            "https://api.apilayer.com/image_to_text/upload",
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
            
                // Set the extracted text in state
                setExtractedText(result["all_text"]); 
            })
            .catch((error) => console.log("error", error));
    };

    return (
        <SafeAreaView style={styles.container}>
            <Button
                title="Pick an image from gallery"
                onPress={pickImageGallery}
            />
            <Button
                title="Pick an image from camera"
                onPress={pickImageCamera}
            />
            <Text style={styles.text1}>
                {extractedText}
            </Text>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  expenseText: {
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
