import React from 'react';
import { View, Text, FlatList } from 'react-native';

// Sample expense data
const expenses = [
  { id: '1', date: '2024-09-15', category: 'Groceries', amount: '$50.00' },
  { id: '2', date: '2024-09-18', category: 'Transport', amount: '$15.00' },
  { id: '3', date: '2024-09-19', category: 'Dining Out', amount: '$30.00' },
  { id: '4', date: '2024-09-20', category: 'Entertainment', amount: '$25.00' },
];

export default function HomeScreen() {
  const renderItem = ({ item }) => (
    <View className="flex-row justify-between p-3 border-b border-gray-300">
      <Text className="text-lg flex-1">{item.date}</Text>
      <Text className="text-lg flex-1">{item.category}</Text>
      <Text className="text-lg flex-1">{item.amount}</Text>
    </View>
  );

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl mb-5">Expenses</Text>
      <View className="w-full">
        <View className="flex-row justify-between p-3 bg-gray-200">
          <Text className="font-bold text-sm flex-1">Date</Text>
          <Text className="font-bold text-sm flex-1">Category</Text>
          <Text className="font-bold text-sm flex-1">Amount</Text>
        </View>
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}