import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme, Text, Button, IconButton, Card, List, Divider } from 'react-native-paper';
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
  const consts = useThemeBasedConstants();
  const user = useContext(UserContext).user as AppUser;
  const netMonthlyIncome = user.netMonthlyIncome;

  const budgetMap = consts.budgetMap;
  const colorMap = consts.colorMap;

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

  const onValueChange = (event: any, newDate: Date) => {
    const date = newDate || selectedDate;
    setIsPickerOpen(false);
    setSelectedDate(date);
  };

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

  return (
    <View style={styles.container}>
      <View style={[styles.dateNavContainer, {backgroundColor:theme.colors.surface}]}>
        <IconButton icon="chevron-left" onPress={() => setSelectedDate(subMonths(selectedDate, 1))} iconColor={theme.colors.onPrimaryContainer} size={30} />
        <TouchableOpacity onPress={() => setIsPickerOpen(true)}>
          <Text style={styles.dateDisplay}>{format(selectedDate, 'MMMM yyyy')}</Text>
        </TouchableOpacity>
        <IconButton icon="chevron-right" onPress={() => setSelectedDate(addMonths(selectedDate, 1))} iconColor={theme.colors.onPrimaryContainer} size={30} />
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
          ['need', 'want', 'save'].map((type, index) => (
            <Card key={index} style={[styles.budgetCategory, { borderColor: consts.colorMap[type], backgroundColor: theme.colors.surface }]}>
              <List.Accordion
                title={`${consts.budgetMap[type]} - $${(netMonthlyIncome *getBudgetType(type) / 100).toFixed(2)} Available`}
                left={props => <List.Icon {...props} icon="folder" color={consts.colorMap[type]} />}
                titleStyle={{ color: consts.colorMap[type], fontWeight: '700' }}
                style={styles.accordion}
              >
                <Divider />
                {monthlyBudget.allocations.filter(alloc => alloc.type === type).map((alloc: Allocation) => (
                  <List.Item
                    key={alloc.allocationId}
                    title={alloc.description}
                    description={`Funded: $${alloc.amount.toFixed(2)}`}
                    left={props => <List.Icon {...props} icon="label-outline" />}
                  />
                ))}
                <Button icon="plus" mode="contained" onPress={() => console.log('Add allocation')} color={consts.colorMap[type]}>
                  Add {type}
                </Button>
              </List.Accordion>
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
  },
  dateNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateDisplay: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentArea: {
    flex: 1,
  },
  budgetCategory: {
    margin: 10,
    elevation: 4,
    borderRadius: 10,
  },
  accordion: {
    padding: 10,
    borderRadius: 10,
  },
});
