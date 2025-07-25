import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../contexts/HealthContext';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { state, computed } = useHealth();
  const [selectedTab, setSelectedTab] = useState('Overview');
  
  const tabs = ['Overview', 'Water', 'Steps', 'Sleep'];

  const WeeklySummary = () => {
    const waterData = computed.getWeeklyData('water');
    const stepData = computed.getWeeklyData('steps');
    const sleepData = computed.getWeeklyData('sleep');

    const waterGoalsMet = waterData.filter(day => day.value >= state.user.dailyGoals.water).length;
    const stepGoalsMet = stepData.filter(day => day.value >= state.user.dailyGoals.steps).length;
    const sleepGoalsMet = sleepData.filter(day => day.value >= state.user.dailyGoals.sleep).length;

    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>📊 Weekly Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{waterGoalsMet}</Text>
            <Text style={styles.summaryLabel}>Water goals met</Text>
            <Ionicons name="water" size={20} color="#4A90E2" />
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{stepGoalsMet}</Text>
            <Text style={styles.summaryLabel}>Step goals met</Text>
            <Ionicons name="walk" size={20} color="#50C878" />
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{sleepGoalsMet}</Text>
            <Text style={styles.summaryLabel}>Sleep goals met</Text>
            <Ionicons name="moon" size={20} color="#9B59B6" />
          </View>
        </View>
      </View>
    );
  };

  const SimpleChart = ({ data, color, unit, goal }) => {
    const maxValue = Math.max(...data.map(d => d.value), goal);
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {data.map((day, index) => {
            const height = (day.value / maxValue) * 100;
            const isGoalMet = day.value >= goal;
            
            return (
              <View key={index} style={styles.chartBar}>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: `${Math.max(height, 2)}%`,
                        backgroundColor: isGoalMet ? color : '#bdc3c7'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.dayLabel}>{day.day}</Text>
                <Text style={styles.dayValue}>
                  {unit === 'ml' && day.value > 1000 
                    ? `${(day.value / 1000).toFixed(1)}L`
                    : unit === 'steps' && day.value > 1000
                    ? `${(day.value / 1000).toFixed(1)}k`
                    : unit === 'h'
                    ? `${day.value.toFixed(1)}h`
                    : `${day.value}${unit}`
                  }
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.goalLine}>
          <Text style={styles.goalText}>Goal: {goal}{unit}</Text>
        </View>
      </View>
    );
  };

  const OverviewTab = () => (
    <View>
      <WeeklySummary />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Goal Completion This Week</Text>
        <View style={styles.goalCompletionChart}>
          {['Water', 'Steps', 'Sleep'].map((metric, index) => {
            const colors = ['#4A90E2', '#50C878', '#9B59B6'];
            const data = computed.getWeeklyData(metric.toLowerCase());
            const goals = [state.user.dailyGoals.water, state.user.dailyGoals.steps, state.user.dailyGoals.sleep];
            const goalsMet = data.filter(day => day.value >= goals[index]).length;
            const percentage = (goalsMet / 7) * 100;
            
            return (
              <View key={metric} style={styles.goalMetric}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalMetricName}>{metric}</Text>
                  <Text style={styles.goalPercentage}>{Math.round(percentage)}%</Text>
                </View>
                <View style={styles.goalProgressBar}>
                  <View 
                    style={[
                      styles.goalProgressFill,
                      { width: `${percentage}%`, backgroundColor: colors[index] }
                    ]} 
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsGrid}>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementEmoji}>🏆</Text>
            <Text style={styles.achievementTitle}>First Week</Text>
            <Text style={styles.achievementDesc}>Complete your first week of tracking</Text>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementEmoji}>💧</Text>
            <Text style={styles.achievementTitle}>Hydration Hero</Text>
            <Text style={styles.achievementDesc}>Meet water goal 7 days in a row</Text>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementEmoji}>🚶</Text>
            <Text style={styles.achievementTitle}>Step Master</Text>
            <Text style={styles.achievementDesc}>Reach 10,000 steps in a day</Text>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementEmoji}>😴</Text>
            <Text style={styles.achievementTitle}>Sleep Champion</Text>
            <Text style={styles.achievementDesc}>Get 8+ hours of sleep</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const MetricTab = ({ metric, color, unit, goal }) => {
    const data = computed.getWeeklyData(metric);
    const average = data.reduce((sum, day) => sum + day.value, 0) / 7;
    const best = Math.max(...data.map(d => d.value));
    const goalsMet = data.filter(day => day.value >= goal).length;

    return (
      <View>
        <View style={styles.metricStats}>
          <View style={styles.metricStat}>
            <Text style={styles.metricStatValue}>
              {unit === 'ml' && average > 1000 
                ? `${(average / 1000).toFixed(1)}L`
                : unit === 'steps' && average > 1000
                ? `${(average / 1000).toFixed(1)}k`
                : `${average.toFixed(1)}${unit}`
              }
            </Text>
            <Text style={styles.metricStatLabel}>Daily Average</Text>
          </View>
          <View style={styles.metricStat}>
            <Text style={styles.metricStatValue}>
              {unit === 'ml' && best > 1000 
                ? `${(best / 1000).toFixed(1)}L`
                : unit === 'steps' && best > 1000
                ? `${(best / 1000).toFixed(1)}k`
                : `${best.toFixed(1)}${unit}`
              }
            </Text>
            <Text style={styles.metricStatLabel}>Best Day</Text>
          </View>
          <View style={styles.metricStat}>
            <Text style={styles.metricStatValue}>{goalsMet}/7</Text>
            <Text style={styles.metricStatLabel}>Goals Met</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <SimpleChart data={data} color={color} unit={unit} goal={goal} />
        </View>
      </View>
    );
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'Overview':
        return <OverviewTab />;
      case 'Water':
        return <MetricTab metric="water" color="#4A90E2" unit="ml" goal={state.user.dailyGoals.water} />;
      case 'Steps':
        return <MetricTab metric="steps" color="#50C878" unit="steps" goal={state.user.dailyGoals.steps} />;
      case 'Sleep':
        return <MetricTab metric="sleep" color="#9B59B6" unit="h" goal={state.user.dailyGoals.sleep} />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="bar-chart" size={32} color="#4A90E2" />
        <Text style={styles.title}>Analytics</Text>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && styles.activeTab
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab && styles.activeTabText
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4A90E2',
  },
  tabText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summaryContainer: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryCard: {
    alignItems: 'center',
    flex: 1,
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginVertical: 4,
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
  goalCompletionChart: {
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
  goalMetric: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalMetricName: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  goalPercentage: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: (width - 48) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  achievementEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 16,
  },
  metricStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 12,
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
  metricStat: {
    alignItems: 'center',
  },
  metricStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  metricStatLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    textAlign: 'center',
  },
  chartContainer: {
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
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
  },
  chartBar: {
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
  goalLine: {
    alignItems: 'center',
  },
  goalText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});

