
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
// Home Screen - Shows the expense table

// Sample expense data
const expenses = [
  { id: '1', date: '2024-09-15', category: 'Groceries', amount: '$50.00' },
  { id: '2', date: '2024-09-18', category: 'Transport', amount: '$15.00' },
  { id: '3', date: '2024-09-19', category: 'Dining Out', amount: '$30.00' },
  { id: '4', date: '2024-09-20', category: 'Entertainment', amount: '$25.00' },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expenses</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text style={styles.expenseText}>{item.date}</Text>
            <Text style={styles.expenseText}>{item.category}</Text>
            <Text style={styles.expenseText}>{item.amount}</Text>
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Date</Text>
            <Text style={styles.tableHeaderText}>Category</Text>
            <Text style={styles.tableHeaderText}>Amount</Text>
          </View>
        }
      />
    </View>
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
