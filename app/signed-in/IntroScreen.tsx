import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, processColor } from 'react-native';
import {
  Button,
  Card,
  Title,
  TextInput,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import  Slider  from '@react-native-community/slider';
import { PieChart } from 'react-native-charts-wrapper';
import { AppUser } from '../models/appUser';
import { BaseBudget } from '../models/budget/budget';
import auth from '@react-native-firebase/auth';
import { useAlerts } from 'react-native-paper-alerts';
import UserService from '../services/UserService';
import BudgetService from '../services/BudgetService';

export const IntroScreen = ({
  onProfileUpdate,
}: {
  onProfileUpdate: (user: AppUser) => void;
}) => {
  const theme = useTheme();
  const alerts = useAlerts();
  const [netMonthlyIncome, setNetMonthlyIncome] = useState<number>(2000);
  const [needPercentage, setNeedPercentage] = useState<number>(50);
  const [wantPercentage, setWantPercentage] = useState<number>(30);
  const [savePercentage, setSavePercentage] = useState<number>(20);
  const [isLoading, setIsLoading] = useState(false);
  const [needAmount, setNeedAmount] = useState<number>(0);
  const [wantAmount, setWantAmount] = useState<number>(0);
  const [saveAmount, setSaveAmount] = useState<number>(0);

  useEffect(() => {
    setNeedAmount((netMonthlyIncome * needPercentage) / 100);
    setWantAmount((netMonthlyIncome * wantPercentage) / 100);
    setSaveAmount((netMonthlyIncome * savePercentage) / 100);
  }, [netMonthlyIncome, needPercentage, wantPercentage, savePercentage]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const authUser = auth().currentUser;
      if (authUser) {
        const budget: Omit<BaseBudget, 'budgetId'> = {
          userId: authUser.uid,
          needPercentage,
          wantPercentage,
          savePercentage,
        };
        const budgetId = await BudgetService.createBaseBudget(budget);
        const user: AppUser = {
          displayName: authUser.displayName || '',
          email: authUser.email || '',
          uid: authUser.uid,
          netMonthlyIncome,
          budgetId,
        };
        await UserService.addUser(user);
        onProfileUpdate(user);
      }
    } catch (error: any) {
      alerts.alert(
        'Error',
        `An error occurred while updating the profile: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const unallocatedPercentage = 100 - (needPercentage + wantPercentage + savePercentage);

  const pieData = [
    { value: needPercentage, label: 'Needs', color: processColor(theme.colors.error) },
    { value: wantPercentage, label: 'Wants', color: processColor(theme.colors.tertiary) },
    { value: savePercentage, label: 'Savings', color: processColor(theme.colors.primary) },
    { value: unallocatedPercentage, label: 'Unallocated', color: processColor('#ffffff') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.pieChartContainer}>
          <PieChart
            style={styles.pieChart}
            logEnabled={true}
            chartBackgroundColor={processColor(theme.colors.background)}
            data={{
              dataSets: [{
                values: pieData,
                label: '',
                config: {
                  colors: pieData.map((entry) => entry.color),
                  valueTextSize: 20,
                  valueTextColor: processColor(theme.colors.onSurface),
                  sliceSpace: 5,
                  selectionShift: 13,
                },
              }],
            }}
            legend={{
              enabled: true,
              textSize: 15,
              form: 'CIRCLE',
              wordWrapEnabled: true,
            }}
            entryLabelColor={processColor(theme.colors.onSurface)}
            entryLabelTextSize={15}
            rotationEnabled={true}
            rotationAngle={45}
            usePercentValues={true}
            styledCenterText={{ text: 'Budget', color: processColor(theme.colors.onSurface), size: 20 }}
            centerTextRadiusPercent={100}
            holeRadius={40}
            holeColor={processColor(theme.colors.background)}
            transparentCircleRadius={45}
            transparentCircleColor={processColor('#f0f0f088')}
            maxAngle={360}
          />
        </View>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.title, { color: theme.colors.primary }]}>
              Setup Your Budget
            </Title>
            <TextInput
              label="Net Monthly Income"
              value={netMonthlyIncome.toString()}
              onChangeText={(text) => setNetMonthlyIncome(parseFloat(text))}
              keyboardType="numeric"
              style={styles.input}
              theme={{ colors: { text: theme.colors.onPrimary, primary: theme.colors.primary } }}
            />
            <View style={styles.sliderContainer}>
              <View style={styles.sliderRow}>
                <Text style={[styles.sliderLabel, { color: theme.colors.error }]}>
                  Needs: {needPercentage}%
                </Text>
                <Text style={[styles.amountLabel, { color: theme.colors.error }]}>
                  ${needAmount.toFixed(2)}
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={3}
                maximumValue={100}
                step={1}
                value={needPercentage}
                onValueChange={setNeedPercentage}
                minimumTrackTintColor={theme.colors.error}
                thumbTintColor={theme.colors.error}
              />
            </View>
            <View style={styles.sliderContainer}>
              <View style={styles.sliderRow}>
                <Text style={[styles.sliderLabel, { color: theme.colors.tertiary }]}>
                  Wants: {wantPercentage}%
                </Text>
                <Text style={[styles.amountLabel, { color: theme.colors.tertiary }]}>
                  ${wantAmount.toFixed(2)}
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={3}
                maximumValue={100}
                step={1}
                value={wantPercentage}
                onValueChange={setWantPercentage}
                minimumTrackTintColor={theme.colors.tertiary}
                thumbTintColor={theme.colors.tertiary}
              />
            </View>
            <View style={styles.sliderContainer}>
              <View style={styles.sliderRow}>
                <Text style={[styles.sliderLabel, { color: theme.colors.primary }]}>
                  Savings: {savePercentage}%
                </Text>
                <Text style={[styles.amountLabel, { color: theme.colors.primary }]}>
                  ${saveAmount.toFixed(2)}
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={3}
                maximumValue={100}
                step={1}
                value={savePercentage}
                onValueChange={setSavePercentage}
                minimumTrackTintColor={theme.colors.primary}
                thumbTintColor={theme.colors.primary}
              />
            </View>
            {isLoading ? (
              <ActivityIndicator
                animating={true}
                size="large"
                style={styles.loader}
                color={theme.colors.primary}
              />
            ) : (
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
                buttonColor={theme.colors.primary}
                textColor={theme.colors.onPrimaryContainer}
              >
                Save
              </Button>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  pieChartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pieChart: {
    height: 200,
    width: 200,
  },
  card: {
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 20,
    borderRadius: 5,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sliderLabel: {
    fontSize: 16,
  },
  amountLabel: {
    fontSize: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  button: {
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
});
