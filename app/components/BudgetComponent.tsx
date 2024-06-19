import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme, Text, Button, IconButton, Card } from 'react-native-paper';
import MonthPicker from 'react-native-month-year-picker';
import { format, addMonths, subMonths } from 'date-fns';

import { MonthlyBudget, Allocation } from '../models/budget/budget';
import BudgetService from '../services/BudgetService';
import { AppUser } from '../models/appUser';
import { UserContext } from '../contexts/AuthContext';
import { useThemeBasedConstants } from '../util/consts';

export const BudgetComponent = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthlyBudget, setMonthlyBudget] = useState<MonthlyBudget | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const user = useContext(UserContext).user as AppUser;
  const { colorMap, budgetMap } = useThemeBasedConstants();
  const netMonthlyIncome = user.netMonthlyIncome;

  useEffect(() => {
    async function fetchBudget() {
      const userBudget = await BudgetService.getBaseBudget(user.budgetId);
      setMonthlyBudget({
        ...userBudget,
        monthYear: format(selectedDate, 'MM-yyyy'),
        allocations: [],
      });
    }

    fetchBudget();
  }, [selectedDate, user.uid, user.budgetId]);

  const getBudgetType = (type: string) => {
    if(!monthlyBudget) return 0;

    if(budgetMap[type] === 'Needs') {
        return monthlyBudget.needPercentage;
    }
    else if(budgetMap[type] === 'Wants') {
        return monthlyBudget.wantPercentage;
    }
    else {
        return monthlyBudget.savePercentage;
    }
  }

  const onValueChange = useCallback((event: any, newDate: Date) => {
    const date = newDate || selectedDate;
    setIsPickerOpen(false);
    setSelectedDate(date);
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <View style={styles.dateNavContainer}>
        <IconButton icon="arrow-left" onPress={() => setSelectedDate(subMonths(selectedDate, 1))} />
        <TouchableOpacity onPress={() => setIsPickerOpen(true)}>
          <Text style={styles.dateDisplay}>{format(selectedDate, 'MMMM yyyy')}</Text>
        </TouchableOpacity>
        <IconButton icon="arrow-right" onPress={() => setSelectedDate(addMonths(selectedDate, 1))} />
      </View>

      {isPickerOpen && (
        <MonthPicker
          locale="en"
          value={selectedDate}
          onChange={onValueChange}
        />
      )}

      <ScrollView style={styles.contentArea}>
        {monthlyBudget && (
          ['need', 'want', 'save'].map((type) => (
            <Card key={type} style={[styles.budgetCategory, { borderColor: colorMap[type] }]}>
              <Card.Title title={`${budgetMap[type]}: $${(netMonthlyIncome * getBudgetType(type) / 100).toFixed(2)}`} titleStyle={{ color: colorMap[type] }} />
              <Card.Content>
                {monthlyBudget.allocations.filter(alloc => alloc.type === type).map((alloc: Allocation) => (
                  <Text key={alloc.allocationId} style={styles.allocationText}>
                    {alloc.description}: ${alloc.amount.toFixed(2)}
                  </Text>
                ))}
                <Button icon="plus" mode="contained" color={colorMap[type]}
                  onPress={() => console.log('Add allocation for', type)}>Add {type}</Button>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  dateNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateDisplay: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentArea: {
    flex: 1,
  },
  budgetCategory: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  allocationText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
