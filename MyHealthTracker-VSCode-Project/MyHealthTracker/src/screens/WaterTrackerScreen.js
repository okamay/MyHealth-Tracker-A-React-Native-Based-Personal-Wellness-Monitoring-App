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

export default function WaterTrackerScreen() {
  const { state, actions, computed } = useHealth();
  const [customAmount, setCustomAmount] = useState('');
  
  const todayWater = computed.getTodayWater();
  const dailyGoal = state.user.dailyGoals.water;
  const progress = (todayWater / dailyGoal) * 100;
  const remaining = Math.max(0, dailyGoal - todayWater);

  const quickAmounts = [250, 500, 750, 1000];

  const addWater = (amount) => {
    if (amount > 0) {
      actions.addWaterEntry(amount);
      Alert.alert('Success', `Added ${amount}ml of water!`);
    }
  };

  const addCustomWater = () => {
    const amount = parseInt(customAmount);
    if (amount && amount > 0 && amount <= 2000) {
      addWater(amount);
      setCustomAmount('');
    } else {
      Alert.alert('Invalid Amount', 'Please enter a valid amount between 1-2000ml');
    }
  };

  const WaterBottle = () => {
    const fillHeight = Math.min(progress, 100);
    
    return (
      <View style={styles.bottleContainer}>
        <View style={styles.bottle}>
          <View style={styles.bottleCap} />
          <View style={styles.bottleBody}>
            <View 
              style={[
                styles.waterFill, 
                { height: `${fillHeight}%` }
              ]} 
            />
            <Text style={styles.percentageText}>{Math.round(progress)}%</Text>
          </View>
        </View>
        <View style={styles.waterInfo}>
          <Text style={styles.waterAmount}>
            {todayWater}ml
            <Text style={styles.waterGoal}> / {dailyGoal}ml</Text>
          </Text>
          <Text style={styles.remainingText}>{remaining}ml remaining</Text>
        </View>
      </View>
    );
  };

  const QuickAddButton = ({ amount }) => (
    <TouchableOpacity
      style={[styles.quickButton, { backgroundColor: getButtonColor(amount) }]}
      onPress={() => addWater(amount)}
    >
      <Ionicons name="water" size={20} color="white" />
      <Text style={styles.quickButtonText}>{amount}ml</Text>
    </TouchableOpacity>
  );

  const getButtonColor = (amount) => {
    const colors = ['#3498db', '#f39c12', '#9b59b6', '#1abc9c'];
    const index = quickAmounts.indexOf(amount);
    return colors[index] || '#3498db';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="water" size={32} color="#4A90E2" />
          <Text style={styles.title}>Water Tracker</Text>
        </View>

        <WaterBottle />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickButtonsGrid}>
            {quickAmounts.map(amount => (
              <QuickAddButton key={amount} amount={amount} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Amount</Text>
          <View style={styles.customInputContainer}>
            <TextInput
              style={styles.customInput}
              placeholder="Enter amount (ml)"
              value={customAmount}
              onChangeText={setCustomAmount}
              keyboardType="numeric"
              maxLength={4}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addCustomWater}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's History</Text>
          {state.waterEntries
            .filter(entry => entry.date === new Date().toISOString().split('T')[0])
            .reverse()
            .slice(0, 5)
            .map(entry => (
              <View key={entry.id} style={styles.historyItem}>
                <Ionicons name="water" size={16} color="#4A90E2" />
                <Text style={styles.historyAmount}>{entry.amount}ml</Text>
                <Text style={styles.historyTime}>
                  {new Date(entry.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            ))}
          {state.waterEntries.filter(entry => 
            entry.date === new Date().toISOString().split('T')[0]
          ).length === 0 && (
            <Text style={styles.noDataText}>No water logged today yet</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips</Text>
          <View style={styles.tipCard}>
            <Ionicons name="bulb" size={20} color="#f39c12" />
            <Text style={styles.tipText}>
              Drink a glass of water when you wake up to kickstart your metabolism!
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="time" size={20} color="#3498db" />
            <Text style={styles.tipText}>
              Set reminders every 2 hours to maintain consistent hydration.
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
  bottleContainer: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottle: {
    alignItems: 'center',
    marginBottom: 16,
  },
  bottleCap: {
    width: 40,
    height: 20,
    backgroundColor: '#95a5a6',
    borderRadius: 10,
    marginBottom: 4,
  },
  bottleBody: {
    width: 120,
    height: 200,
    borderWidth: 3,
    borderColor: '#3498db',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  waterFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3498db',
    opacity: 0.7,
  },
  percentageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    zIndex: 1,
  },
  waterInfo: {
    alignItems: 'center',
  },
  waterAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  waterGoal: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#7f8c8d',
  },
  remainingText: {
    fontSize: 14,
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
  quickButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickButton: {
    width: (width - 48) / 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    marginRight: 12,
  },
  addButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
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
  historyAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 8,
    flex: 1,
  },
  historyTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  noDataText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
    padding: 20,
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

