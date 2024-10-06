import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getData } from './AsyncMethod';
import { PieChart } from 'react-native-gifted-charts';

// Define an enum-like object to map categories to colors
const categoryColors = {
  'Fruits & Vegs': '#FFB6C1',
  'Meat': '#FF6347',
  'Seafood': '#1E90FF',
  'Dairy': '#FFD700',
  'Snacks': '#7CFC00',
};

// Function to sum amounts by category and convert to the required format with percentages and colors
const sumAndConvertToPercentage = (data) => {
  const categorySums = {};

  // Calculate the sum for each category
  data.forEach(item => {
    const category = item.category;
    const amount = parseFloat(item.amount); // Convert amount to a float

    // Initialize category sum if it doesn't exist
    if (!categorySums[category]) {
      categorySums[category] = 0;
    }
    // Add the amount to the corresponding category sum
    categorySums[category] += amount;
  });

  // Calculate total sum of all categories
  const totalSum = Object.values(categorySums).reduce((acc, curr) => acc + curr, 0);

  // Convert the category sums to the format required by the PieChart (with percentage and color)
  const result = Object.entries(categorySums).map(([category, sum]) => {
    const percentage = ((sum / totalSum) * 100).toFixed(2); // Calculate percentage and format to 2 decimal places
    return {
      text: category, // Category name
      value: parseFloat(percentage), // Percentage
      color: categoryColors[category] || '#CCCCCC', // Use the color from the enum, or a default color if not found
    };
  });

  return result;
};

export default function HomeScreen() {
  const [historyExpenses, setHistoryExpenses] = useState([]);

  // Use useFocusEffect to refresh data whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      getData(setHistoryExpenses);
    }, [])
  );

  // Get the category sums and percentages in the required format
  const formattedData = sumAndConvertToPercentage(historyExpenses);

  // Render Legend Item
  const renderLegendItem = ({ text, value, color }) => (
    <View className="flex-row items-center mb-2" key={text}>
      <View style={{ backgroundColor: color }} className="w-4 h-4 mr-2 rounded-full" />
      <Text className="text-lg">{text}: {value}%</Text>
    </View>
  );

  return (
    <ScrollView
  className="flex flex-col content-center p-4"
  
>
      <Text className="text-2xl mb-5">Expenses</Text>
      <View className="flex-col items-center content-center">
      <PieChart
        data={formattedData}
        width={400} // Set the width of the pie chart
        height={400} // Set the height of the pie chart
        chartConfig={{
          paddingLeft: 20,
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2, // Optional
        }}
      />

      {/* Legend in flex column layout */}
      <View className="mt-4">
        {formattedData.map(item => renderLegendItem(item))}
      </View>
    </View>
    </ScrollView>
  );
}
