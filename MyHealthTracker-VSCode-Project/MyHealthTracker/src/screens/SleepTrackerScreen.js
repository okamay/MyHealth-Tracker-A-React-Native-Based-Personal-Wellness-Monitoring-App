import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../contexts/HealthContext';

export default function SleepTrackerScreen() {
  const { state, actions, computed } = useHealth();
  const [bedtime, setBedtime] = useState(new Date());
  const [wakeTime, setWakeTime] = useState(new Date());
  const [quality, setQuality] = useState(3);
  const [showBedtimePicker, setShowBedtimePicker] = useState(false);
  const [showWakeTimePicker, setShowWakeTimePicker] = useState(false);
  
  const lastSleep = computed.getLastSleep();
  const dailyGoal = state.user.dailyGoals.sleep;

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateDuration = () => {
    const duration = (wakeTime - bedtime) / (1000 * 60 * 60);
    return Math.max(0, duration);
  };

  const logSleep = () => {
    const duration = calculateDuration();
    if (duration > 0 && duration <= 24) {
      actions.addSleepEntry(bedtime, wakeTime, quality);
      Alert.alert('Success', `Logged ${duration.toFixed(1)} hours of sleep!`);
    } else {
      Alert.alert('Invalid Time', 'Please check your bedtime and wake time');
    }
  };

  const QualityButton = ({ rating, emoji, label }) => (
    <TouchableOpacity
      style={[
        styles.qualityButton,
        quality === rating && styles.qualityButtonActive
      ]}
      onPress={() => setQuality(rating)}
    >
      <Text style={styles.qualityEmoji}>{emoji}</Text>
      <Text style={[
        styles.qualityLabel,
        quality === rating && styles.qualityLabelActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const SleepChart = () => {
    const weeklyData = computed.getWeeklyData('sleep');
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Sleep Pattern</Text>
        <View style={styles.chart}>
          {weeklyData.map((day, index) => {
            const height = (day.value / 12) * 100; // Max 12 hours for chart
            const isGoodSleep = day.value >= dailyGoal;
            
            return (
              <View key={index} style={styles.dayColumn}>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.sleepBar, 
                      { 
                        height: `${Math.min(height, 100)}%`,
                        backgroundColor: isGoodSleep ? '#9B59B6' : '#bdc3c7'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.dayLabel}>{day.day}</Text>
                <Text style={styles.dayValue}>
                  {day.value > 0 ? `${day.value.toFixed(1)}h` : '0h'}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#9B59B6' }]} />
            <Text style={styles.legendText}>Goal achieved</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#bdc3c7' }]} />
            <Text style={styles.legendText}>Below goal</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="moon" size={32} color="#9B59B6" />
          <Text style={styles.title}>Sleep Tracker</Text>
        </View>

        {lastSleep && (
          <View style={styles.lastSleepCard}>
            <Text style={styles.lastSleepTitle}>Last Night's Sleep</Text>
            <View style={styles.sleepStats}>
              <View style={styles.sleepStat}>
                <Ionicons name="bed" size={20} color="#9B59B6" />
                <Text style={styles.sleepStatValue}>{lastSleep.duration.toFixed(1)}h</Text>
                <Text style={styles.sleepStatLabel}>Duration</Text>
              </View>
              <View style={styles.sleepStat}>
                <Ionicons name="star" size={20} color="#f39c12" />
                <Text style={styles.sleepStatValue}>{lastSleep.quality}/5</Text>
                <Text style={styles.sleepStatLabel}>Quality</Text>
              </View>
              <View style={styles.sleepStat}>
                <Ionicons name="moon" size={20} color="#34495e" />
                <Text style={styles.sleepStatValue}>
                  {formatTime(new Date(lastSleep.bedtime))}
                </Text>
                <Text style={styles.sleepStatLabel}>Bedtime</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Log Sleep</Text>
          
          <View style={styles.timeInputs}>
            <View style={styles.timeInput}>
              <Text style={styles.timeLabel}>Bedtime</Text>
              <TouchableOpacity 
                style={styles.timeButton}
                onPress={() => setShowBedtimePicker(true)}
              >
                <Ionicons name="time" size={20} color="#9B59B6" />
                <Text style={styles.timeText}>{formatTime(bedtime)}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.timeInput}>
              <Text style={styles.timeLabel}>Wake Time</Text>
              <TouchableOpacity 
                style={styles.timeButton}
                onPress={() => setShowWakeTimePicker(true)}
              >
                <Ionicons name="sunny" size={20} color="#f39c12" />
                <Text style={styles.timeText}>{formatTime(wakeTime)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.durationDisplay}>
            <Text style={styles.durationLabel}>Sleep Duration</Text>
            <Text style={styles.durationValue}>
              {calculateDuration().toFixed(1)} hours
            </Text>
          </View>

          <View style={styles.qualitySection}>
            <Text style={styles.qualityTitle}>How was your sleep quality?</Text>
            <View style={styles.qualityButtons}>
              <QualityButton rating={1} emoji="😴" label="Poor" />
              <QualityButton rating={2} emoji="😐" label="Fair" />
              <QualityButton rating={3} emoji="🙂" label="Good" />
              <QualityButton rating={4} emoji="😊" label="Great" />
              <QualityButton rating={5} emoji="😍" label="Excellent" />
            </View>
          </View>

          <TouchableOpacity style={styles.logButton} onPress={logSleep}>
            <Ionicons name="checkmark" size={24} color="white" />
            <Text style={styles.logButtonText}>Log Sleep</Text>
          </TouchableOpacity>
        </View>

        <SleepChart />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep Tips</Text>
          <View style={styles.tipCard}>
            <Ionicons name="bulb" size={20} color="#f39c12" />
            <Text style={styles.tipText}>
              Maintain a consistent sleep schedule, even on weekends.
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="phone-portrait" size={20} color="#e74c3c" />
            <Text style={styles.tipText}>
              Avoid screens for at least 1 hour before bedtime.
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="thermometer" size={20} color="#3498db" />
            <Text style={styles.tipText}>
              Keep your bedroom cool, dark, and quiet for optimal sleep.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 12,
  },
  lastSleepCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lastSleepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  sleepStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sleepStat: {
    alignItems: 'center',
  },
  sleepStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  sleepStatLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  timeInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeInput: {
    flex: 0.48,
  },
  timeLabel: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 8,
    fontWeight: '600',
  },
  timeButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  timeText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 8,
    fontWeight: '600',
  },
  durationDisplay: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  durationLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  durationValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9B59B6',
    marginTop: 4,
  },
  qualitySection: {
    marginBottom: 20,
  },
  qualityTitle: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  qualityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qualityButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 2,
    borderColor: '#ecf0f1',
  },
  qualityButtonActive: {
    borderColor: '#9B59B6',
    backgroundColor: '#f8f4ff',
  },
  qualityEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  qualityLabel: {
    fontSize: 10,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  qualityLabelActive: {
    color: '#9B59B6',
  },
  logButton: {
    backgroundColor: '#9B59B6',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 80,
    width: 20,
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  sleepBar: {
    width: '100%',
    borderRadius: 10,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  dayValue: {
    fontSize: 10,
    color: '#2c3e50',
    fontWeight: '600',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#2c3e50',
    marginLeft: 12,
    lineHeight: 20,
  },
});

