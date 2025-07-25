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
  Switch,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../contexts/HealthContext';

export default function SettingsScreen() {
  const { state, actions } = useHealth();
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [waterGoal, setWaterGoal] = useState(state.user.dailyGoals.water.toString());
  const [stepGoal, setStepGoal] = useState(state.user.dailyGoals.steps.toString());
  const [sleepGoal, setSleepGoal] = useState(state.user.dailyGoals.sleep.toString());
  const [notifications, setNotifications] = useState(state.user.preferences.notifications);

  const saveGoals = () => {
    const newWaterGoal = parseInt(waterGoal);
    const newStepGoal = parseInt(stepGoal);
    const newSleepGoal = parseInt(sleepGoal);

    if (newWaterGoal > 0 && newStepGoal > 0 && newSleepGoal > 0) {
      actions.setUser({
        dailyGoals: {
          water: newWaterGoal,
          steps: newStepGoal,
          sleep: newSleepGoal
        }
      });
      setShowGoalsModal(false);
      Alert.alert('Success', 'Daily goals updated successfully!');
    } else {
      Alert.alert('Error', 'Please enter valid goals');
    }
  };

  const toggleNotifications = (value) => {
    setNotifications(value);
    actions.setUser({
      preferences: {
        ...state.user.preferences,
        notifications: value
      }
    });
  };

  const exportData = () => {
    Alert.alert(
      'Export Data',
      'This feature would export your health data to a file. In a real app, this would create a downloadable file.',
      [{ text: 'OK' }]
    );
  };

  const importData = () => {
    Alert.alert(
      'Import Data',
      'This feature would allow you to import health data from a file. In a real app, this would open a file picker.',
      [{ text: 'OK' }]
    );
  };

  const resetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to delete all your health data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // In a real app, this would clear all data
            Alert.alert('Data Reset', 'All data has been reset successfully.');
          }
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#4A90E2" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />}
    </TouchableOpacity>
  );

  const GoalsModal = () => (
    <Modal
      visible={showGoalsModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowGoalsModal(false)}>
            <Ionicons name="close" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Daily Goals</Text>
          <TouchableOpacity onPress={saveGoals}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.goalInputGroup}>
            <Text style={styles.goalLabel}>💧 Water Goal (ml)</Text>
            <TextInput
              style={styles.goalInput}
              value={waterGoal}
              onChangeText={setWaterGoal}
              keyboardType="numeric"
              placeholder="2000"
            />
            <Text style={styles.goalHint}>Recommended: 2000-3000ml per day</Text>
          </View>
          
          <View style={styles.goalInputGroup}>
            <Text style={styles.goalLabel}>🚶 Step Goal</Text>
            <TextInput
              style={styles.goalInput}
              value={stepGoal}
              onChangeText={setStepGoal}
              keyboardType="numeric"
              placeholder="10000"
            />
            <Text style={styles.goalHint}>Recommended: 8000-12000 steps per day</Text>
          </View>
          
          <View style={styles.goalInputGroup}>
            <Text style={styles.goalLabel}>😴 Sleep Goal (hours)</Text>
            <TextInput
              style={styles.goalInput}
              value={sleepGoal}
              onChangeText={setSleepGoal}
              keyboardType="numeric"
              placeholder="8"
            />
            <Text style={styles.goalHint}>Recommended: 7-9 hours per night</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings" size={32} color="#4A90E2" />
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals & Preferences</Text>
          
          <SettingItem
            icon="target"
            title="Daily Goals"
            subtitle={`Water: ${state.user.dailyGoals.water}ml • Steps: ${state.user.dailyGoals.steps.toLocaleString()} • Sleep: ${state.user.dailyGoals.sleep}h`}
            onPress={() => setShowGoalsModal(true)}
          />
          
          <SettingItem
            icon="notifications"
            title="Notifications"
            subtitle="Receive reminders and alerts"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#bdc3c7', true: '#4A90E2' }}
                thumbColor={notifications ? '#ffffff' : '#ffffff'}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <SettingItem
            icon="download"
            title="Export Data"
            subtitle="Download your health data"
            onPress={exportData}
          />
          
          <SettingItem
            icon="cloud-upload"
            title="Import Data"
            subtitle="Import data from a backup file"
            onPress={importData}
          />
          
          <SettingItem
            icon="trash"
            title="Reset All Data"
            subtitle="Delete all stored health data"
            onPress={resetData}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.appName}>MyHealth Tracker</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              A personal wellness monitoring app for tracking water intake, steps, sleep, and medications.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          
          <View style={styles.tipCard}>
            <Ionicons name="bulb" size={20} color="#f39c12" />
            <Text style={styles.tipText}>
              Consistency is key! Try to track your activities at the same time each day.
            </Text>
          </View>
          
          <View style={styles.tipCard}>
            <Ionicons name="heart" size={20} color="#e74c3c" />
            <Text style={styles.tipText}>
              Small improvements in daily habits can lead to significant health benefits over time.
            </Text>
          </View>
          
          <View style={styles.tipCard}>
            <Ionicons name="trophy" size={20} color="#f39c12" />
            <Text style={styles.tipText}>
              Set realistic goals and celebrate your achievements, no matter how small!
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for your health and wellness
          </Text>
        </View>
      </ScrollView>

      <GoalsModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
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
  settingItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
    lineHeight: 16,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
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
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 20,
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
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  saveButton: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  goalInputGroup: {
    marginBottom: 24,
  },
  goalLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
    fontWeight: '600',
  },
  goalInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    marginBottom: 8,
  },
  goalHint: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
});

