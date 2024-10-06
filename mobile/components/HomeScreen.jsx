import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PieChart } from 'react-native-gifted-charts';
import { styled } from 'nativewind';
import { useFocusEffect } from "@react-navigation/native";
import { getData } from "./AsyncMethod";

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledScrollView = styled(ScrollView)
const StyledSafeAreaView = styled(SafeAreaView)

// Category colors mapping remains the same
const categoryColors = {
  "Dairy & Eggs": "#FFD700",
  "Snacks & Candy": "#FF69B4",
  "Baked & Bakery": "#F5DEB3",
  "Frozen Food": "#ADD8E6",
  "Meat": "#FF6347",
  "Seafood": "#1E90FF",
  "Pantry": "#8FBC8F",
  "Drinks": "#FF4500",
  "Fruits & Vegs": "#FFB6C1",
};

// getCategoryIcon function remains the same
const getCategoryIcon = (category) => {
  switch (category.toLowerCase()) {
    case "dairy & eggs": return "egg";
    case "snacks & candy": return "candy-cane";
    case "baked & bakery": return "bread-slice";
    case "frozen food": return "snowflake";
    case "meat": return "food-steak";
    case "seafood": return "fish";
    case "pantry": return "cupboard-outline";
    case "drinks": return "cup";
    case "fruits & vegs": return "fruit-grapes";
    default: return "shopping";
  }
};

// SummaryCard component remains the same
const SummaryCard = ({ category, amount }) => (
  <StyledView className="bg-gray-800 rounded-xl p-4 mb-2 flex-row justify-between items-center">
    <StyledView className="flex-row items-center">
      <Icon name={getCategoryIcon(category)} size={24} color="#9CA3AF" />
      <StyledText className="text-gray-300 text-lg ml-2">{category}</StyledText>
    </StyledView>
    <StyledText className="text-white text-xl font-bold">${amount.toFixed(2)}</StyledText>
  </StyledView>
);

// sumAndConvertToPercentage function remains the same
const sumAndConvertToPercentage = (data) => {
  const categorySums = {};

  data.forEach((item) => {
    const category = item.category;
    const amount = parseFloat(item.amount);
    if (!isNaN(amount) && amount > 0) { // Ensure the amount is a valid number and greater than 0
      if (!categorySums[category]) {
        categorySums[category] = 0;
      }
      categorySums[category] += amount;
    } else {
      console.error(`Invalid amount for item: ${JSON.stringify(item)}`);
    }
  });

  console.log(data)

  const totalSum = Object.values(categorySums).reduce((acc, curr) => acc + curr, 0);

  return Object.entries(categorySums).map(([category, sum]) => ({
    text: category,
    value: parseFloat(((sum / totalSum) * 100).toFixed(2)),
    color: categoryColors[category] || "#CCCCCC",
    amount: sum
  }));
};

// ExpensePieChart component remains the same
const ExpensePieChart = ({ data }) => {
  const formattedData = sumAndConvertToPercentage(data);
  
  const totalAmount = data.reduce((sum, item) => {
    const amount = parseFloat(item.amount);
    return !isNaN(amount) && amount > 0 ? sum + amount : sum;
  }, 0);

  console.log(data);
  console.log(`Total Amount: ${totalAmount}`);

  const renderLegendItem = ({ text, value, color }) => (
    <StyledView className="flex-row items-center mb-2" key={text}>
      <StyledView
        style={{ backgroundColor: color }}
        className="w-4 h-4 mr-2 rounded-full"
      />
      <StyledText className="text-gray-300">{text}: {value}%</StyledText>
    </StyledView>
  );

  return (
    <StyledView className="bg-gray-800 rounded-xl p-4 mb-4">
      <StyledText className="text-gray-300 text-lg mb-4">Expense Breakdown</StyledText>
      <StyledView className="items-center">
        <PieChart
          data={formattedData.map(item => ({
            value: item.value,
            color: item.color,
            gradientCenterColor: item.color,
          }))}
          donut
          radius={80}
          innerRadius={60}
          centerLabelComponent={() => (
            <StyledView className="items-center justify-center">
              <StyledText className="text-gray-400 text-xl font-bold">${totalAmount.toFixed(2)}</StyledText>
              <StyledText className="text-gray-400 text-sm">Total</StyledText>
            </StyledView>
          )}
        />
      </StyledView>
      <StyledView className="mt-4">
        {formattedData.map(renderLegendItem)}
      </StyledView>
    </StyledView>
  );
};

const TwoWeekSummary = ({ data }) => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  
  const recentExpenses = data.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= twoWeeksAgo;
  });

  const categorySums = sumAndConvertToPercentage(recentExpenses);
  
  return (
    <StyledView className="mb-4">
      <StyledText className="text-white text-xl mb-3">Last Month Summary</StyledText>
      {categorySums.map(item => (
        <SummaryCard key={item.text} category={item.text} amount={item.amount} />
      ))}
    </StyledView>
  );
};

const HomeScreen = () => {
  const [historyExpenses, setHistoryExpenses] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      getData(setHistoryExpenses);
    }, [])
  );

  return (
    <StyledSafeAreaView className="flex-1 bg-gray-900">
      <StyledScrollView className="flex-1">
        <StyledView className="p-4">
          <StyledText className="text-white text-2xl mb-5">Expenses</StyledText>
          <ExpensePieChart data={historyExpenses} />
          <TwoWeekSummary data={historyExpenses} />
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default HomeScreen;