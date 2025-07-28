import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TimerContext } from '../context/TimerContext';

export default function HistoryScreen() {
  const { state } = useContext(TimerContext);

  const renderItem = ({ item }) => {
    const date = new Date(item.completedAt);
    return (
      <View style={styles.item}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.timestamp}>
          Completed at: {date.toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Timers</Text>

      {state.history.length === 0 ? (
        <Text style={styles.empty}>No completed timers yet.</Text>
      ) : (
        <FlatList
          data={state.history}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    color: '#555',
    marginTop: 4,
  },
  empty: {
    fontStyle: 'italic',
    marginTop: 20,
    color: '#888',
  },
});
