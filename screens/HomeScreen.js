import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { TimerContext } from '../context/TimerContext';
import TimerItem from '../components/TimerItem';
import uuid from 'react-native-uuid';

export default function HomeScreen({ navigation }) {
  const { state, dispatch } = useContext(TimerContext);
  const [expandedCategories, setExpandedCategories] = useState({});

  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');

  const handleAddTimer = () => {
    if (!name || !duration || !category) return;

    const newTimer = {
      id: uuid.v4(),
      name,
      duration: parseInt(duration),
      remaining: parseInt(duration),
      category,
      status: 'paused',
      halfwayAlertShown: false,
    };

    dispatch({ type: 'ADD_TIMER', payload: newTimer });
    setName('');
    setDuration('');
    setCategory('');
  };

  // Group timers by category
  const groupedTimers = {};
  state.timers.forEach((timer) => {
    if (!groupedTimers[timer.category]) {
      groupedTimers[timer.category] = [];
    }
    groupedTimers[timer.category].push(timer);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Timer</Text>
      <TextInput
        style={styles.input}
        placeholder="Timer Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Duration (in seconds)"
        value={duration}
        keyboardType="numeric"
        onChangeText={setDuration}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <Button title="Add Timer" onPress={handleAddTimer} />

      <Text style={styles.title}>Timers</Text>
      <FlatList
        data={Object.keys(groupedTimers)}
        keyExtractor={(item) => item}
        renderItem={({ item: category }) => (
          <View style={styles.group}>
            <TouchableOpacity
              onPress={() =>
                setExpandedCategories(prev => ({
                  ...prev,
                  [category]: !prev[category],
                }))
              }
              style={styles.groupHeader}
            >
              <Text style={styles.groupTitle}>
                {category} {expandedCategories[category] ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>

            {expandedCategories[category] && (
              <>
                <View style={styles.groupActions}>
                  <Button
                    title="Start All"
                    onPress={() =>
                      groupedTimers[category].forEach((t) =>
                        dispatch({ type: 'START_TIMER', id: t.id })
                      )
                    }
                  />
                  <Button
                    title="Pause All"
                    onPress={() =>
                      groupedTimers[category].forEach((t) =>
                        dispatch({ type: 'PAUSE_TIMER', id: t.id })
                      )
                    }
                  />
                  <Button
                    title="Reset All"
                    onPress={() =>
                      groupedTimers[category].forEach((t) =>
                        dispatch({ type: 'RESET_TIMER', id: t.id })
                      )
                    }
                  />
                </View>

                {groupedTimers[category].map((timer) => (
                  <TimerItem key={timer.id} timer={timer} />
                ))}
              </>
            )}
          </View>
        )}
      />

      <TouchableOpacity onPress={() => navigation.navigate('History')}>
        <Text style={styles.link}>View History ➜</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 5,
    padding: 8,
    borderRadius: 5,
  },
  group: {
    marginVertical: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  groupActions: {
    flexDirection: 'row',
    gap: 5,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: 'blue',
  },
});