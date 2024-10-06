import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getData } from './AsyncMethod';

export default function HomeScreen() {

  const [historyExpenses, setHistoryExpenses] = useState([]);

  // Use useFocusEffect to refresh data whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      getData(setHistoryExpenses);
    }, [])
  );

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
          data={historyExpenses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}