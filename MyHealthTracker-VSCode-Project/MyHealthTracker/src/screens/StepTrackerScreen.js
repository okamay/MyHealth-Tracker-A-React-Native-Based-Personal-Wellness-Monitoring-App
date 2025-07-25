import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../contexts/HealthContext';

const { width } = Dimensions.get('window');

export default function StepTrackerScreen() {
  const { state, actions, computed } = useHealth();
  const [stepInput, setStepInput] = useState('');
  
  const todaySteps = computed.getTodaySteps();
  const dailyGoal = state.user.dailyGoals.steps;
  const progress = (todaySteps / dailyGoal) * 100;
  const remaining = Math.max(0, dailyGoal - todaySteps);
  
  // Calculate estimated values
  const distance = (todaySteps * 0.0008).toFixed(2); // km
  const calories = Math.round(todaySteps * 0.04);

  const addSteps = () => {
    const steps = parseInt(stepInput);
    if (steps && steps > 0 && steps <= 50000) {
      actions.addStepEntry(steps);
      Alert.alert('Success', `Logged ${steps.toLocaleString()} steps!`);
      setStepInput('');
    } else {
      Alert.alert('Invalid Steps', 'Please enter a valid number of steps (1-50,000)');
    }
  };

  const CircularProgress = () => {
    const radius = 80;
    const strokeWidth = 12;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;

    return (
      <View style={styles.circularProgressContainer}>
        <svg
          height={radius * 2}
          width={radius * 2}
          style={styles.circularProgress}
        >
          <circle
            stroke="#ecf0f1"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#50C878"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90 ${radius} ${radius})`}
          />
        </svg>
        <View style={styles.progressContent}>
          <Text style={styles.stepsNumber}>{todaySteps.toLocaleString()}</Text>
          <Text style={styles.stepsLabel}>steps</Text>
          <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
        </View>
      </View>
    );
  };

  const StatCard = ({ icon, title, value, unit, color }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="walk" size={32} color="#50C878" />
          <Text style={styles.title}>Step Tracker</Text>
        </View>

        <View style={styles.progressSection}>
          <CircularProgress />
          <View style={styles.goalInfo}>
            <Text style={styles.goalText}>Goal: {dailyGoal.toLocaleString()} steps</Text>
            <Text style={styles.remainingText}>
              {remaining > 0 ? `${remaining.toLocaleString()} steps to go!` : 'Goal achieved! 🎉'}
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="location"
            title="Distance"
            value={distance}
            unit="km"
            color="#3498db"
          />
          <StatCard
            icon="flame"
            title="Calories"
            value={calories}
            unit="kcal"
            color="#e74c3c"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Log Steps</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.stepInput}
              placeholder="Enter number of steps"
              value={stepInput}
              onChangeText={setStepInput}
              keyboardType="numeric"
              maxLength={6}
            />
            <TouchableOpacity
              style={styles.logButton}
              onPress={addSteps}
            >
              <Ionicons name="add" size={24} color="white" />
              <Text style={styles.logButtonText}>Log</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.weeklyChart}>
            {computed.getWeeklyData('steps').map((day, index) => {
              const dayProgress = (day.value / dailyGoal) * 100;
              return (
                <View key={index} style={styles.dayColumn}>
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height: `${Math.min(dayProgress, 100)}%`,
                          backgroundColor: dayProgress >= 100 ? '#50C878' : '#95a5a6'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.dayLabel}>{day.day}</Text>
                  <Text style={styles.dayValue}>
                    {day.value > 1000 ? `${(day.value / 1000).toFixed(1)}k` : day.value}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Tips</Text>
          <View style={styles.tipCard}>
            <Ionicons name="bulb" size={20} color="#f39c12" />
            <Text style={styles.tipText}>
              Take the stairs instead of the elevator to add extra steps to your day!
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="time" size={20} color="#3498db" />
            <Text style={styles.tipText}>
              A 10-minute walk can add approximately 1,000-1,200 steps.
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="heart" size={20} color="#e74c3c" />
            <Text style={styles.tipText}>
              Regular walking improves cardiovascular health and boosts mood.
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
  progressSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  circularProgressContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  circularProgress: {
    transform: [{ rotate: '-90deg' }],
  },
  progressContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  stepsLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#50C878',
    marginTop: 4,
  },
  goalInfo: {
    alignItems: 'center',
  },
  goalText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 4,
  },
  remainingText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  statUnit: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  statTitle: {
    fontSize: 14,
    color: '#2c3e50',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    marginRight: 12,
  },
  logButton: {
    backgroundColor: '#50C878',
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
    marginLeft: 4,
  },
  weeklyChart: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  bar: {
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

