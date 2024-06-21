import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import {
  useTheme,
  Text,
  Button,
  IconButton,
  Card,
  List,
  Divider,
} from 'react-native-paper';
import MonthPicker from 'react-native-month-year-picker';
import {format, addMonths, subMonths, set} from 'date-fns';

import {MonthlyBudget, Allocation, BaseBudget} from '../models/budget/budget';
import BudgetService from '../services/BudgetService';
import {AppUser} from '../models/appUser';
import {UserContext} from '../contexts/AuthContext';
import {useThemeBasedConstants} from '../util/consts';

export const BudgetComponent = ({
  isIntro,
  newUser,
  baseBudget,
  onProfileUpdate,
}: {
  isIntro: boolean;
  newUser: AppUser | undefined;
  baseBudget: BaseBudget | undefined;
  onProfileUpdate: ((x: AppUser) => void) | undefined;
}) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthlyBudget, setMonthlyBudget] = useState<MonthlyBudget | null>(
    null,
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const consts = useThemeBasedConstants();
  const user = useContext(UserContext).user as AppUser;
  const [netMonthlyIncome, setNetMonthlyIncome] = useState(0);

  const budgetMap = consts.budgetMap;
  const colorMap = consts.colorMap;
  const iconMap = consts.iconMap;

  useEffect(() => {
    if (!isIntro) {
        setNetMonthlyIncome(user.netMonthlyIncome);
      async function fetchBudget() {
        const userBudget = await BudgetService.getBaseBudget(user.budgetId);
        setMonthlyBudget({
          ...userBudget,
          monthYear: format(selectedDate, 'MM-yyyy'),
          allocations: [],
        });
      }
      fetchBudget();
    } else {
        setNetMonthlyIncome(newUser?.netMonthlyIncome || 0);
        setMonthlyBudget({
            ...baseBudget as BaseBudget,
            monthYear: format(selectedDate, 'MM-yyyy'),
            allocations: [],
        });
    }
  }, [selectedDate, user?.uid, user?.budgetId]);

  const onValueChange = (event: any, newDate: Date) => {
    const date = newDate || selectedDate;
    setIsPickerOpen(false);
    setSelectedDate(date);
  };

  const getBudgetType = (type: string) => {
    if (!monthlyBudget) return 0;
    if (budgetMap[type] === 'Needs') {
      return monthlyBudget.needPercentage;
    } else if (budgetMap[type] === 'Wants') {
      return monthlyBudget.wantPercentage;
    } else {
      return monthlyBudget.savePercentage;
    }
  };

  return (
    <View style={styles.container}>
      {!isIntro && (
        <View
        style={[
          styles.dateNavContainer,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: '#E8EBEE',
            borderBottomWidth: 1,
          },
        ]}>
        <IconButton
          icon="chevron-left"
          onPress={() => setSelectedDate(subMonths(selectedDate, 1))}
          iconColor={theme.colors.onPrimaryContainer}
          size={30}
        />
        <TouchableOpacity onPress={() => setIsPickerOpen(true)}>
          <Text style={styles.dateDisplay}>
            {format(selectedDate, 'MMMM yyyy')}
          </Text>
        </TouchableOpacity>
        <IconButton
          icon="chevron-right"
          onPress={() => setSelectedDate(addMonths(selectedDate, 1))}
          iconColor={theme.colors.onPrimaryContainer}
          size={30}
        />
      </View>
      )}

      {isPickerOpen && (
        <MonthPicker
          locale="en"
          value={selectedDate}
          onChange={onValueChange}
        />
      )}

      <ScrollView style={styles.contentArea}>
        {monthlyBudget &&
          ['need', 'want', 'save'].map((type, index) => (
            <Card
              key={index}
              style={[
                styles.budgetCategory,
                {
                  borderColor: colorMap[type],
                  backgroundColor: theme.colors.background,
                },
              ]}>
              <List.Accordion
                title={`${consts.budgetMap[type]} - $${(
                  (netMonthlyIncome * getBudgetType(type)) /
                  100
                ).toFixed(2)}`}
                left={props => (
                  <List.Icon
                    {...props}
                    icon={iconMap[type]}
                    color={colorMap[type]}
                  />
                )}
                titleStyle={{
                  color: theme.colors.onBackground,
                  fontWeight: '700',
                }}
                style={styles.accordion}>
                {monthlyBudget.allocations
                  .filter(alloc => alloc.type === type)
                  .map((alloc: Allocation) => (
                    <List.Item
                      key={alloc.allocationId}
                      title={alloc.description}
                      description={`Funded: $${alloc.amount.toFixed(2)}`}
                      left={props => (
                        <List.Icon {...props} icon="label-outline" />
                      )}
                    />
                  ))}
                <Button
                  icon="plus"
                  mode="text"
                  onPress={() => console.log('Add allocation')}
                  textColor={theme.colors.onBackground}
                  style={{
                    borderColor: colorMap[type],
                    borderWidth: 1,
                    borderTopWidth: 0,
                    borderRadius: 0,
                    borderBottomEndRadius: 10,
                    borderBottomStartRadius: 10,
                  }}>
                  Add {type}
                </Button>
              </List.Accordion>
            </Card>
          ))}
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
