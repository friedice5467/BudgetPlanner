import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, ActivityIndicator, Text} from 'react-native';
import {MD3Theme, useTheme} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';

import BudgetService from '../services/BudgetService';
import {UserContext} from '../contexts/AuthContext';
import {AppUser} from '../models/appUser';
import {LineChartSavings} from '../components/TestComponent';
import {lineDataItem} from 'react-native-gifted-charts';
import {differenceInMonths, format} from 'date-fns';
import { getItemDate } from '../util/helpers';

const Analysis = () => {
  const theme = useTheme();
  const user = useContext(UserContext).user as AppUser;
  const [selectedRange, setSelectedRange] = useState('12');
  const [chartData, setChartData] = useState<lineDataItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await BudgetService.getMonthlyBudgetsAllTime(
          user.budgetId,
        );
        console.log('Data:', data);
        const filteredData = data.filter(item => {
            console.log(`Item date: ${getItemDate(item.monthYear)}`)
            const monthsAgo = differenceInMonths(new Date(), getItemDate(item.monthYear));
            console.log(`Months ago: ${monthsAgo}`)
            switch (selectedRange) {
              case '1':
                return monthsAgo < 1; // Last month
              case '6':
                return monthsAgo < 6; // Last 6 months
              case '12':
                return monthsAgo < 12; // Last 12 months
              default:
                return true; // All time
            }
          });
          console.log('Filtered data:', filteredData);
        const formattedData = filteredData.map(item => ({
          date: format(getItemDate(item.monthYear), 'MMM yyyy'),
          value:
            item.excessMoney.need +
            item.excessMoney.want +
            item.excessMoney.save,
          label: format(getItemDate(item.monthYear), 'MM-yyyy'),
        }));
        setChartData(formattedData);
        console.log('Formatted data:', formattedData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedRange, user.budgetId]);

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View
        style={{
          backgroundColor: theme.colors.surface,
          borderBottomColor: '#E8EBEE',
          borderBottomWidth: 1,
        }}>
        <Text style={[styles.title, {color: theme.colors.onSurface}]}>
          Expenditure Analysis
        </Text>
      </View>
      <RNPickerSelect
        value={selectedRange}
        onValueChange={setSelectedRange}
        items={[
          {label: 'Current Month', value: '1'},
          {label: 'Last 6 Months', value: '6'},
          {label: 'Last 12 Months', value: '12'},
          {label: 'All Time', value: '69'},
        ]}
        style={pickerSelectStyles(theme)}
      />
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <LineChartSavings data={chartData} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    flex: 1,
  },
});

const pickerSelectStyles = (theme: MD3Theme) => ({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 4,
    color: theme.colors.onBackground,
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    color: theme.colors.onBackground,
    paddingRight: 30,
  },
});

export default Analysis;
