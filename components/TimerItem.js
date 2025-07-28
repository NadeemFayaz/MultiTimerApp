import React, { useEffect, useRef, useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { TimerContext } from '../context/TimerContext';
import * as Progress from 'react-native-progress';

export default function TimerItem({ timer }) {
  const { dispatch } = useContext(TimerContext);
  const intervalRef = useRef(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const percentage =
    timer.duration > 0 ? timer.remaining / timer.duration : 0;

  useEffect(() => {
    if (timer.status === 'running') {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          dispatch({ type: 'TICK', id: timer.id });
        }, 1000);
      }

      // Show halfway alert if not yet shown
      if (
        !timer.halfwayAlertShown &&
        timer.remaining <= timer.duration / 2
      ) {
        Alert.alert('Halfway There!', `Timer "${timer.name}" is halfway done.`);
        dispatch({ type: 'HALFWAY_ALERT_SHOWN', id: timer.id });
      }

      // Handle completion
      if (timer.remaining <= 0) {
        dispatch({ type: 'COMPLETE_TIMER', id: timer.id, name: timer.name });
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setShowCompleteModal(true);
      }
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [timer.status, timer.remaining]);

  // Show the alert when showCompleteModal state changes
  useEffect(() => {
    if (showCompleteModal) {
      Alert.alert(
        'Timer Complete!',
        `🎉 ${timer.name} is done!`,
        [{ text: 'OK', onPress: () => setShowCompleteModal(false) }]
      );
    }
  }, [showCompleteModal, timer.name]);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{timer.name}</Text>
      <Text>Status: {timer.status}</Text>
      <Text>Time Left: {timer.remaining}s</Text>
      <Progress.Bar
        progress={percentage}
        width={null}
        height={10}
        color="#3b82f6"
        borderRadius={4}
        style={{ marginVertical: 6 }}
      />

      <View style={styles.buttons}>
        {timer.status !== 'running' && timer.status !== 'completed' && (
          <Button
            title="Start"
            onPress={() => dispatch({ type: 'START_TIMER', id: timer.id })}
          />
        )}
        {timer.status === 'running' && (
          <Button
            title="Pause"
            onPress={() => dispatch({ type: 'PAUSE_TIMER', id: timer.id })}
          />
        )}
        <Button
          title="Reset"
          onPress={() => dispatch({ type: 'RESET_TIMER', id: timer.id })}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fefefe',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-start',
    marginTop: 8,
  },
});