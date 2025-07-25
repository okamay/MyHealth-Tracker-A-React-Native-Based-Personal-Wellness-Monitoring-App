import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../contexts/HealthContext';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation, isTrackingHub = false }) {
  const { state, computed } = useHealth();
  
  const todayWater = computed.getTodayWater();
  const todaySteps = computed.getTodaySteps();
  const lastSleep = computed.getLastSleep();
  const todayMedications = computed.getTodayMedications();

  const waterProgress = (todayWater / state.user.dailyGoals.water) * 100;
  const stepProgress = (todaySteps / state.user.dailyGoals.steps) * 100;
  const sleepProgress = lastSleep ? (lastSleep.duration / state.user.dailyGoals.sleep) * 100 : 0;
  const medicationProgress = todayMedications.length > 0 
    ? (todayMedications.filter(med => med.taken).length / todayMedications.length) * 100 
    : 100;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 18) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const StatCard = ({ title, value, unit, progress, color, icon, onPress }) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>
        {value}
        <Text style={styles.statUnit}> {unit}</Text>
      </Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${Math.min(progress, 100)}%`, backgroundColor: color }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}% of goal</Text>
      </View>
    </TouchableOpacity>
  );

  const QuickActionButton = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.quickAction, { borderColor: color }]} onPress={onPress}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.quickActionText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {!isTrackingHub && (
          <View style={styles.header}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.date}>{formatDate()}</Text>
          </View>
        )}

        <View style={styles.statsGrid}>
          <StatCard
            title="Water"
            value={todayWater}
            unit={`/ ${state.user.dailyGoals.water}ml`}
            progress={waterProgress}
            color="#4A90E2"
            icon="water"
            onPress={() => navigation?.navigate('WaterTracker')}
          />
          
          <StatCard
            title="Steps"
            value={todaySteps.toLocaleString()}
            unit={`/ ${state.user.dailyGoals.steps.toLocaleString()}`}
            progress={stepProgress}
            color="#50C878"
            icon="walk"
            onPress={() => navigation?.navigate('StepTracker')}
          />
          
          <StatCard
            title="Sleep"
            value={lastSleep ? `${lastSleep.duration.toFixed(1)}h` : '0h'}
            unit={`/ ${state.user.dailyGoals.sleep}h`}
            progress={sleepProgress}
            color="#9B59B6"
            icon="moon"
            onPress={() => navigation?.navigate('SleepTracker')}
          />
          
          <StatCard
            title="Medications"
            value={todayMedications.filter(med => med.taken).length}
            unit={`/ ${todayMedications.length}`}
            progress={medicationProgress}
            color="#E67E22"
            icon="medical"
            onPress={() => navigation?.navigate('Medications')}
          />
        </View>

        {!isTrackingHub && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                <QuickActionButton
                  title="Log Water"
                  icon="water"
                  color="#4A90E2"
                  onPress={() => navigation?.navigate('Track', { screen: 'WaterTracker' })}
                />
                <QuickActionButton
                  title="Add Steps"
                  icon="walk"
                  color="#50C878"
                  onPress={() => navigation?.navigate('Track', { screen: 'StepTracker' })}
                />
                <QuickActionButton
                  title="Log Sleep"
                  icon="moon"
                  color="#9B59B6"
                  onPress={() => navigation?.navigate('Track', { screen: 'SleepTracker' })}
                />
                <QuickActionButton
                  title="Medications"
                  icon="medical"
                  color="#E67E22"
                  onPress={() => navigation?.navigate('Track', { screen: 'Medications' })}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
              <View style={styles.reminderCard}>
                <Ionicons name="time" size={20} color="#666" />
                <Text style={styles.reminderText}>2:00 PM - Drink water</Text>
                <Text style={styles.reminderType}>water</Text>
              </View>
              {todayMedications.filter(med => !med.taken).slice(0, 2).map(med => (
                <View key={med.id} style={styles.reminderCard}>
                  <Ionicons name="medical" size={20} color="#E67E22" />
                  <Text style={styles.reminderText}>{med.time} - {med.name}</Text>
                  <Text style={styles.reminderType}>medication</Text>
                </View>
              ))}
            </View>
          </>
        )}
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
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  statUnit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#7f8c8d',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: (width - 48) / 2,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 2,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  reminderCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  reminderText: {
    flex: 1,
    fontSize: 14,
    color: '#2c3e50',
    marginLeft: 12,
  },
  reminderType: {
    fontSize: 12,
    color: '#7f8c8d',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});

