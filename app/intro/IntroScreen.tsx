import React, {useState, useCallback} from 'react';
import {StyleSheet, View, processColor} from 'react-native';
import {
  Button,
  Card,
  Title,
  TextInput,
  useTheme,
  ActivityIndicator
} from 'react-native-paper';
import Slider from '@react-native-community/slider';
import {PieChart} from 'react-native-charts-wrapper';
import {AppUser} from '../models/appUser';
import {BaseBudget} from '../models/budget/budget';
import auth from '@react-native-firebase/auth';
import {useAlerts} from 'react-native-paper-alerts';
import { useOpenPercentageSlider } from '../components/PercentageSliderModal';
import { useThemeBasedConstants } from '../util/consts';
import { IntroScreenProps } from '../models/navigation';
import { useProfile } from '../contexts/NewUserContext';
import {format} from 'date-fns';

export const IntroScreen: React.FC<IntroScreenProps> = ({ navigation }) => {
  const { setUser, setBaseBudget } = useProfile();
  const theme = useTheme();
  const alerts = useAlerts();
  const [netMonthlyIncome, setNetMonthlyIncome] = useState(4000);
  interface Percentages {
    [key: string]: number;
  }
  const [percentages, setPercentages] = useState<Percentages>({
    need: 50,
    want: 30,
    save: 20,
  });
  const constants = useThemeBasedConstants();
  const [isLoading, setIsLoading] = useState(false);

  const adjustSliders = useCallback((name: string, value: number) => {
    if (value >= 100 || value <= 0){
        alerts.alert('Error', 'value must be between 1 and 99')
        return;
    }
    setPercentages((prev: Percentages) => {
      const otherKeys = Object.keys(prev).filter(k => k !== name);
      let total = value + otherKeys.reduce((acc, key) => acc + prev[key], 0);
      let overflow = total - 100;

      if (overflow > 0) {
        const adjustments: Percentages = {};
        let remainingOverflow = overflow;
        for (let key of otherKeys) {
          if (remainingOverflow <= 0) break;
          const available = prev[key] - 1; // Minimum 1% constraint
          const deduction = Math.min(available, remainingOverflow);
          adjustments[key] = prev[key] - deduction;
          remainingOverflow -= deduction;
        }
        return {...prev, ...adjustments, [name]: value};
      }
      return {...prev, [name]: value};
    });
  }, []);

  const handleIncomeChange = (text: string) => {
    const value = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (!isNaN(value) && value >= 0) {
      setNetMonthlyIncome(value);
    }
  };

  const navigateToAllocation = () => {
    navigation.navigate('IntroAllocationScreen');
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const authUser = auth().currentUser;
      if (authUser) {
        const needPercentage = percentages.need;
        const wantPercentage = percentages.want;
        const savePercentage = percentages.save;

        const baseBudget: Omit<BaseBudget, 'budgetId'> = {
          userId: authUser.uid,
          netMonthlyIncome,
          needPercentage,
          wantPercentage,
          savePercentage,
          baseAllocations: [],
        };
        const newUser: AppUser = {
          displayName: authUser.displayName || '',
          email: authUser.email || '',
          uid: authUser.uid,
          budgetId: '',
          startDate: format(new Date(), 'MM-yyyy')
        };
        setIsLoading(false);
        setUser(newUser);
        setBaseBudget(baseBudget as BaseBudget);
        navigateToAllocation();
      }
    } catch (error: any) {
      alerts.alert(
        'Error',
        `An error occurred while updating the profile: ${error.message}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const pieData = [
    {
      value: percentages.need,
      label: 'Needs',
      color: processColor(theme.colors.error),
    },
    {
      value: percentages.want,
      label: 'Wants',
      color: processColor(theme.colors.tertiary),
    },
    {
      value: percentages.save,
      label: 'Savings',
      color: processColor(theme.colors.primary),
    },
  ];

  const openSlider = useOpenPercentageSlider();

  const renderSlider = (
    label: string,
    value: number,
    setValue: (value: number) => void,
    color: string,
  ) => (
    <View style={styles.sliderContainer} key={label}>
      <Button
        mode="text"
        onPress={() => openSlider(label, value.toString(), setValue)}
        textColor={theme.colors.onBackground}
        style={{borderColor: color, borderWidth: 2, borderRadius: 25}}>
        {label}: {value}%
      </Button>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={98}
        step={1}
        value={value}
        onValueChange={setValue}
        minimumTrackTintColor={color}
        thumbTintColor={color}

      />
    </View>
  );

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title
            style={[styles.title, {backgroundColor: theme.colors.surface}]}>
            Setup Your Budget
          </Title>
          <TextInput
            mode="outlined"
            label="Net Monthly Income"
            value={`$${netMonthlyIncome.toFixed(2)}`}
            onChangeText={text => handleIncomeChange(text)}
            keyboardType="numeric"
            style={[styles.input, {backgroundColor: theme.colors.surface}]}
            outlineColor="#cccccc"
            activeOutlineColor={theme.colors.primary}
          />
          <PieChart
            chartDescription={{text: ''}}
            style={styles.pieChart}
            chartBackgroundColor={processColor(theme.colors.surface)}
            data={{
              dataSets: [
                {
                  values: pieData,
                  label: '',
                  config: {
                    colors: pieData.map(entry => entry.color),
                    valueTextSize: 0,
                    valueTextColor: processColor(theme.colors.onSurface),
                    sliceSpace: 0,
                    selectionShift: 13,
                  },
                },
              ],
            }}
            legend={{enabled: false}}
            drawEntryLabels={false}
            holeRadius={0}
            transparentCircleRadius={0}
          />
          {['need', 'want', 'save'].map((key: string) =>
            renderSlider(
              key[0].toUpperCase() + key.slice(1),
              percentages[key],
              value => adjustSliders(key, value),
              constants.colorMap[key],
            ),
          )}
          {isLoading ? (
            <ActivityIndicator
              animating={true}
              style={styles.loader}
              color={theme.colors.primary}
            />
          ) : (
            <Button
              icon={'arrow-right'}
              textColor={theme.colors.onPrimary}
              mode="contained"
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.button}
              labelStyle={{fontSize: 18}}>
              Next
            </Button>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
  },
  card: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 5,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
    fontSize: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sliderLabel: {
    fontSize: 20,
    flex: 1,
  },
  slider: {
    flex: 2,
    height: 80,
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  pieChart: {
    height: 240,
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});
