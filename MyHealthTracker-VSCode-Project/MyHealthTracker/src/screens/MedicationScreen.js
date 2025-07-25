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
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../contexts/HealthContext';

export default function MedicationScreen() {
  const { state, actions, computed } = useHealth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [time, setTime] = useState('08:00');
  const [notes, setNotes] = useState('');

  const todayMedications = computed.getTodayMedications();
  const frequencies = ['Once daily', 'Twice daily', 'Three times daily', 'As needed'];

  const addMedication = () => {
    if (medicationName.trim() && dosage.trim()) {
      actions.addMedication({
        name: medicationName.trim(),
        dosage: dosage.trim(),
        frequency,
        time,
        notes: notes.trim(),
        reminders: true
      });
      
      // Reset form
      setMedicationName('');
      setDosage('');
      setFrequency('Once daily');
      setTime('08:00');
      setNotes('');
      setShowAddModal(false);
      
      Alert.alert('Success', 'Medication added successfully!');
    } else {
      Alert.alert('Error', 'Please fill in medication name and dosage');
    }
  };

  const toggleMedicationTaken = (medicationId, taken) => {
    actions.logMedication(medicationId, !taken);
    const action = !taken ? 'taken' : 'unmarked';
    Alert.alert('Updated', `Medication ${action} successfully!`);
  };

  const deleteMedication = (medicationId, medicationName) => {
    Alert.alert(
      'Delete Medication',
      `Are you sure you want to delete ${medicationName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => actions.deleteMedication(medicationId)
        }
      ]
    );
  };

  const MedicationCard = ({ medication }) => (
    <View style={styles.medicationCard}>
      <View style={styles.medicationHeader}>
        <View style={styles.medicationInfo}>
          <Text style={styles.medicationName}>{medication.name}</Text>
          <Text style={styles.medicationDosage}>{medication.dosage}</Text>
          <Text style={styles.medicationFrequency}>{medication.frequency}</Text>
          {medication.time && (
            <Text style={styles.medicationTime}>⏰ {medication.time}</Text>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.takenButton,
            medication.taken && styles.takenButtonActive
          ]}
          onPress={() => toggleMedicationTaken(medication.id, medication.taken)}
        >
          <Ionicons 
            name={medication.taken ? "checkmark-circle" : "ellipse-outline"} 
            size={24} 
            color={medication.taken ? "white" : "#E67E22"} 
          />
        </TouchableOpacity>
      </View>
      
      {medication.notes && (
        <Text style={styles.medicationNotes}>📝 {medication.notes}</Text>
      )}
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteMedication(medication.id, medication.name)}
      >
        <Ionicons name="trash" size={16} color="#e74c3c" />
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const AddMedicationModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowAddModal(false)}>
            <Ionicons name="close" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Add Medication</Text>
          <TouchableOpacity onPress={addMedication}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Medication Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Aspirin"
              value={medicationName}
              onChangeText={setMedicationName}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Dosage *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., 100mg"
              value={dosage}
              onChangeText={setDosage}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Frequency</Text>
            <View style={styles.frequencyButtons}>
              {frequencies.map(freq => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyButton,
                    frequency === freq && styles.frequencyButtonActive
                  ]}
                  onPress={() => setFrequency(freq)}
                >
                  <Text style={[
                    styles.frequencyButtonText,
                    frequency === freq && styles.frequencyButtonTextActive
                  ]}>
                    {freq}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Reminder Time</Text>
            <TextInput
              style={styles.textInput}
              placeholder="08:00"
              value={time}
              onChangeText={setTime}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.notesInput]}
              placeholder="Additional notes..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="medical" size={32} color="#E67E22" />
        <Text style={styles.title}>Medications</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {todayMedications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Medications</Text>
            <View style={styles.progressCard}>
              <Text style={styles.progressText}>
                {todayMedications.filter(med => med.taken).length} of {todayMedications.length} taken
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${todayMedications.length > 0 
                        ? (todayMedications.filter(med => med.taken).length / todayMedications.length) * 100 
                        : 0}%` 
                    }
                  ]} 
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {state.medications.length > 0 ? 'Your Medications' : 'No Medications Added'}
          </Text>
          
          {state.medications.filter(med => med.isActive).length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="medical" size={64} color="#bdc3c7" />
              <Text style={styles.emptyStateText}>No medications added yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Tap the + button to add your first medication
              </Text>
            </View>
          ) : (
            state.medications
              .filter(med => med.isActive)
              .map(medication => {
                const todayMed = todayMedications.find(tm => tm.id === medication.id);
                return (
                  <MedicationCard 
                    key={medication.id} 
                    medication={todayMed || { ...medication, taken: false }} 
                  />
                );
              })
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medication Tips</Text>
          <View style={styles.tipCard}>
            <Ionicons name="time" size={20} color="#3498db" />
            <Text style={styles.tipText}>
              Take medications at the same time each day to maintain consistent levels.
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="restaurant" size={20} color="#e67e22" />
            <Text style={styles.tipText}>
              Some medications should be taken with food, others on an empty stomach.
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="warning" size={20} color="#e74c3c" />
            <Text style={styles.tipText}>
              Never stop taking prescribed medications without consulting your doctor.
            </Text>
          </View>
        </View>
      </ScrollView>

      <AddMedicationModal />
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
    flex: 1,
  },
  addButton: {
    backgroundColor: '#E67E22',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E67E22',
    borderRadius: 4,
  },
  medicationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  medicationDosage: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  medicationFrequency: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  medicationTime: {
    fontSize: 14,
    color: '#E67E22',
    fontWeight: '600',
  },
  medicationNotes: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 8,
    fontStyle: 'italic',
  },
  takenButton: {
    padding: 8,
  },
  takenButtonActive: {
    backgroundColor: '#E67E22',
    borderRadius: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  deleteButtonText: {
    color: '#e74c3c',
    fontSize: 14,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    marginTop: 8,
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
    color: '#E67E22',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  frequencyButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    marginBottom: 8,
  },
  frequencyButtonActive: {
    backgroundColor: '#E67E22',
    borderColor: '#E67E22',
  },
  frequencyButtonText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  frequencyButtonTextActive: {
    color: 'white',
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

