import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Animated, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Feather';

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    current: 0,
    average: 0,
    peak: 0,
  });

  // Animation setup
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://appdevfinalpit.onrender.com/api/current/all/');

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }

        const json = await res.json();
        const formattedData = json.reverse(); // oldest to newest

        setData(formattedData);

        // Calculate statistics
        if (formattedData.length > 0) {
          const currentValue = formattedData[formattedData.length - 1].current;
          const sum = formattedData.reduce((acc, item) => acc + item.current, 0);
          const avg = sum / formattedData.length;
          const peak = Math.max(...formattedData.map(item => item.current));

          setStats({
            current: currentValue.toFixed(2),
            average: avg.toFixed(2),
            peak: peak.toFixed(2),
          });
        }

        setError(null);
      } catch (err) {
        setError('Unable to load data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000); // every 10s
    return () => clearInterval(interval);
  }, []);

  // Format chart data
  const chartData = {
    labels: data.map(item => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [
      {
        data: data.map(item => item.current),
        color: () => '#4361ee',
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View style={styles.welcome}>
            <Text style={styles.welcomeText}>
              Welcome, {userInfo?.first_name || 'User'}
            </Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Export Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="zap" size={24} color="#4361ee" style={styles.statIcon} />
            <View style={styles.statInfo}>
              <Text style={styles.statTitle}>Current Reading</Text>
              <Text style={styles.statValue}>
                {stats.current} <Text style={styles.statUnit}>A</Text>
              </Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Icon name="bar-chart-2" size={24} color="#4361ee" style={styles.statIcon} />
            <View style={styles.statInfo}>
              <Text style={styles.statTitle}>Average Current</Text>
              <Text style={styles.statValue}>
                {stats.average} <Text style={styles.statUnit}>A</Text>
              </Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Icon name="trending-up" size={24} color="#4361ee" style={styles.statIcon} />
            <View style={styles.statInfo}>
              <Text style={styles.statTitle}>Peak Current</Text>
              <Text style={styles.statValue}>
                {stats.peak} <Text style={styles.statUnit}>A</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Live Current Readings</Text>
          <Text style={styles.chartSubtitle}>Real-time power consumption monitoring</Text>
          {loading && data.length === 0 ? (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="large" color="#4361ee" />
            </View>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 32}
              height={400}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 2,
                color: () => '#4361ee',
                labelColor: () => '#8d99ae',
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#4361ee',
                },
              }}
              bezier
              style={styles.chart}
            />
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Last updated:{' '}
            {data.length > 0
              ? new Date(data[data.length - 1]?.timestamp).toLocaleString()
              : 'No data available'}
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    padding: 16,
    paddingTop: 90, // Account for Nav bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcome: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2b2d42',
  },
  dateText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  actionButton: {
    backgroundColor: '#4361ee',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2b2d42',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2b2d42',
  },
  statUnit: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6b7280',
  },
  chartContainer: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2b2d42',
    marginBottom: 8,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  spinnerContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginVertical: 16,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default Dashboard;