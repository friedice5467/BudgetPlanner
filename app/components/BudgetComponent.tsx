import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import {
  useTheme,
  Text,
  Button,
  IconButton,
  Card,
  List,
  TextInput,
  HelperText,
  Switch,
} from 'react-native-paper';
import MonthPicker from 'react-native-month-year-picker';
import {format, addMonths, subMonths} from 'date-fns';

import {
  MonthlyBudget,
  Allocation,
  BaseBudget,
  BudgetType,
  BaseAllocation,
} from '../models/budget/budget';
import BudgetService from '../services/BudgetService';
import UserService from '../services/UserService';
import {AppUser} from '../models/appUser';
import {UserContext} from '../contexts/AuthContext';
import {useModal} from '../contexts/ModalContext';
import {useThemeBasedConstants} from '../util/consts';
import {currencyFormatter, generateUUID} from '../util/helpers';

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
  const {showModal, hideModal, modalVisible, setModalVisible, isLoading, setLoadingState} =
    useModal();
  const [catType, setCatType] = useState('need' as BudgetType);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthlyBudget, setMonthlyBudget] = useState<MonthlyBudget | null>(
    null,
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const consts = useThemeBasedConstants();
  const user = useContext(UserContext).user as AppUser;
  const [netMonthlyIncome, setNetMonthlyIncome] = useState(0);
  const [recurs, setRecurs] = useState(false);
  const [needAmount, setNeedAmount] = useState(0);
  const [wantAmount, setWantAmount] = useState(0);
  const [saveAmount, setSaveAmount] = useState(0);
  const [alloc, setAlloc] = useState<Allocation>();
  const [isEditing, setIsEditing] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const getBudgetAmounts = (type: BudgetType) => {
    switch (type) {
      case 'need':
        return needAmount.toFixed(2);
      case 'want':
        return wantAmount.toFixed(2);
      case 'save':
        return saveAmount.toFixed(2);
      default:
        return 0;
    }
  };

  const getBudgetHandlers = (
    type: BudgetType,
  ): React.Dispatch<React.SetStateAction<number>> => {
    switch (type) {
      case 'need':
        return setNeedAmount;
      case 'want':
        return setWantAmount;
      case 'save':
        return setSaveAmount;
      default:
        throw new Error(`Unhandled budget type: ${type}`);
    }
  };

  const budgetMap = consts.budgetMap;
  const colorMap = consts.colorMap;
  const iconMap = consts.iconMap;

  const calculateAmount = (
    income: number,
    percentage: number,
    allocations: BaseAllocation[],
  ) => {
    const totalAllocated = allocations.reduce(
      (sum, current) => sum + current.amount,
      0,
    );
    return (income * percentage) / 100 - totalAllocated;
  };

  async function GetMonthlyBudget() {
    async function fetchBudget() {
      const baseBudget = await BudgetService.getBaseBudget(user.budgetId);
      setNetMonthlyIncome(baseBudget.netMonthlyIncome);
      const monthlyBudget = await BudgetService.getMonthlyBudget(
        user.budgetId,
        format(selectedDate, 'MM-yyyy'),
      );
      setMonthlyBudget(monthlyBudget);
      setNeedAmount(
        calculateAmount(
            baseBudget.netMonthlyIncome,
          baseBudget.needPercentage,
          monthlyBudget.allocations.filter(
            a => a.type === ('need' as BudgetType),
          ),
        ),
      );
      setWantAmount(
        calculateAmount(
            baseBudget.netMonthlyIncome,
          baseBudget.wantPercentage,
          monthlyBudget.allocations.filter(
            a => a.type === ('want' as BudgetType),
          ),
        ),
      );
      setSaveAmount(
        calculateAmount(
            baseBudget.netMonthlyIncome,
          baseBudget.savePercentage,
          monthlyBudget.allocations.filter(
            a => a.type === ('save' as BudgetType),
          ),
        ),
      );
    }
    fetchBudget();
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoadingState(true);
      if (!isIntro) {
        await GetMonthlyBudget();
      } else {
        setNetMonthlyIncome(baseBudget?.netMonthlyIncome || 0);
        setMonthlyBudget({
          ...(baseBudget as BaseBudget),
          monthYear: format(selectedDate, 'MM-yyyy'),
          allocations: [],
            excessMoney: {
                need: 0,
                want: 0,
                save: 0,
            },
        });
        if (newUser && baseBudget) {
          setNeedAmount(
            (baseBudget.netMonthlyIncome * baseBudget.needPercentage) / 100,
          );
          setWantAmount(
            (baseBudget.netMonthlyIncome * baseBudget.wantPercentage) / 100,
          );
          setSaveAmount(
            (baseBudget.netMonthlyIncome * baseBudget.savePercentage) / 100,
          );
        }
      }
      setLoadingState(false);
    };

    fetchData();
  }, []);

  const onValueChange = async (event: any, newDate: Date) => {
    const date = newDate || selectedDate;
    setIsPickerOpen(false);
    setSelectedDate(date);
    await GetMonthlyBudget();
  };

  const checkIfCurrentMonth = () => {
    return user.startDate === format(new Date(), 'MM-yyyy') ? true : false;
  };

  const getMinDate = () => {
    return new Date(user.startDate);
  };

  const chevronSelect = async (isPast: boolean) => {
    if (isPast) {
      setSelectedDate(subMonths(selectedDate, 1));
    } else {
      setSelectedDate(addMonths(selectedDate, 1));
    }

    await GetMonthlyBudget();
  };

  const handleAmountError = (text: string) => {
    const value = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(value) || value < 0) {
      return true;
    }
    if (value > netMonthlyIncome) {
      return true;
    }
    let effectiveBudgetAmount = parseFloat(
      getBudgetAmounts(catType as BudgetType) as string,
    );
    if (isEditing) {
      effectiveBudgetAmount += value;
    }

    if (value >= effectiveBudgetAmount) {
      return true;
    }
    return false;
  };

  const handleAmountErrorText = (text: string) => {
    const value = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(value) || value < 0) {
      return 'Amount must be a positive number';
    }
    if (value > netMonthlyIncome) {
      return 'Amount cannot exceed net monthly income';
    }
    let effectiveBudgetAmount = parseFloat(
      getBudgetAmounts(catType as BudgetType) as string,
    );
    if (isEditing) {
      effectiveBudgetAmount += value;
    }

    if (value >= effectiveBudgetAmount) {
      return 'Amount cannot exceed budgeted amount';
    }
    return '';
  };

  const handleAmountChange = (text: string) => {
    const value = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (!isNaN(value) && value >= 0) {
      setAmount(value);
    }
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

  const initAllocationModalVals = () => {
    setDescription('');
    setAmount(0);
    setRecurs(isIntro ? true : false);
  };

  const editAllocationModalVals = (alloc: Allocation) => {
    setDescription(alloc.description);
    setAmount(alloc.amount);
    setRecurs(alloc.isStatic);
    setCatType(alloc.type);
    setAlloc(alloc);
    setIsEditing(true);
  };

  const openAllocationModal = (type: string) => {
    setCatType(type as BudgetType);
    initAllocationModalVals();
    setModalVisible(true);
  };

  const addAllocationToCat = () => {
    const newAlloc: Allocation = {
      allocationId: generateUUID(),
      type: catType,
      description: description,
      amount: amount,
      isStatic: recurs,
    };
    monthlyBudget?.allocations.push(newAlloc);
    if (!isIntro) {
      BudgetService.modifyMonthlyBudget(
        monthlyBudget!.budgetId,
        format(selectedDate, 'MM-yyyy'),
        {newAllocation: newAlloc},
      );
    }
    const baseAmt = parseFloat(getBudgetAmounts(catType) as string);
    const handle = getBudgetHandlers(catType);
    handle(baseAmt - amount);
    hideModal();
    setModalVisible(false);
  };

  const editAllocationToCat = async () => {
    const editAlloc: Allocation = {
      allocationId: alloc!.allocationId,
      type: catType,
      description: description,
      amount: amount,
      isStatic: recurs,
    };
    const baseAmt = parseFloat(getBudgetAmounts(catType) as string);
    const handle = getBudgetHandlers(catType);
    handle(baseAmt - amount + alloc!.amount);
    monthlyBudget!.allocations = monthlyBudget!.allocations.map(alloc => {
      if (alloc.allocationId === editAlloc.allocationId) {
        return editAlloc;
      }
      return alloc;
    });
    await BudgetService.modifyMonthlyBudget(
      monthlyBudget!.budgetId,
      format(selectedDate, 'MM-yyyy'),
      {updatedAllocation: editAlloc},
    );
    setIsEditing(false);
    hideModal();
    setModalVisible(false);
  };

  const editAllocation = (alloc: Allocation) => {
    editAllocationModalVals(alloc);
    setModalVisible(true);
  };

  const deleteAllocation = (alloc: Allocation) => {
    setIsDelete(true);
    setAlloc(alloc);
    setModalVisible(true);
  };

  const deleteAllocationHandler = async () => {
    setLoadingState(true);
    await BudgetService.modifyMonthlyBudget(
      monthlyBudget!.budgetId,
      format(selectedDate, 'MM-yyyy'),
      {deleteAllocation: alloc},
    );
    monthlyBudget!.allocations = monthlyBudget!.allocations.filter(
      a => a.allocationId !== alloc!.allocationId,
    );
    const baseAmt = parseFloat(getBudgetAmounts(alloc!.type) as string);
    const handle = getBudgetHandlers(alloc!.type);
    handle(baseAmt + alloc!.amount);
    setLoadingState(false);
    setIsDelete(false);
    setModalVisible(false);
    hideModal();
  };

  const saveIntroBudget = async () => {
    baseBudget!.baseAllocations = monthlyBudget!.allocations;
    const budgetId = await BudgetService.createBaseBudget(
      baseBudget as BaseBudget,
    );
    newUser!.budgetId = budgetId;
    await UserService.addUser(newUser as AppUser);
    if (onProfileUpdate) onProfileUpdate(newUser as AppUser);
  };

  useEffect(() => {
    if (modalVisible && !isDelete) {
      showModal(
        <Card style={styles.cardStyle}>
          <Card.Title
            title={`Add ${
              catType.toString().charAt(0).toUpperCase() +
              catType.toString().slice(1)
            }`}
            titleStyle={{fontSize: 20, textAlign: 'left'}}
            right={props => (
              <View>
                <Text>Recurs Monthly</Text>
                <Switch
                  value={recurs}
                  onValueChange={() => setRecurs(!recurs)}
                />
              </View>
            )}
          />
          <Card.Content>
            <TextInput
              label="Description"
              placeholder='e.g., "Rent" or "Groceries"'
              value={description}
              onChangeText={str => setDescription(str)}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Amount"
              value={'$' + amount.toFixed(2)}
              onChangeText={str => handleAmountChange(str)}
              error={handleAmountError(amount.toString())}
              keyboardType="decimal-pad"
              mode="outlined"
              style={[styles.input, {marginBottom: 0}]}
            />
            <HelperText
              type="error"
              visible={handleAmountError(amount.toString())}>
              {handleAmountErrorText(amount.toString())}
            </HelperText>
            <Button
              mode="contained"
              icon="check"
              onPress={() => {
                if (isEditing) {
                  editAllocationToCat();
                } else {
                  addAllocationToCat();
                }
              }}
              style={styles.button}>
              Confirm
            </Button>
          </Card.Content>
        </Card>,
      );
    } else if (modalVisible && isDelete) {
      showModal(
        <Card style={styles.cardStyle}>
          <Card.Title
            title={`Delete ${
              catType.toString().charAt(0).toUpperCase() +
              catType.toString().slice(1)
            }: ${alloc?.description ? ` ${alloc.description}` : ''}`}
            titleStyle={{fontSize: 20, textAlign: 'left'}}
          />
          <Card.Content>
            <View style={styles.contentContainer}>
              <Text style={styles.alertText}>
                Are you sure you want to delete this allocation?
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  icon="trash-can-outline"
                  loading={isLoading}
                  style={{width: '50%', marginRight: 10}}
                  buttonColor={theme.colors.error}
                  onPress={async () => {
                    await deleteAllocationHandler();
                  }}>
                  Confirm
                </Button>
                <Button
                  mode="outlined"
                  style={{width: '50%'}}
                  onPress={() => {
                    setIsDelete(false);
                    setModalVisible(false);
                    hideModal();
                  }}>
                  Cancel
                </Button>
              </View>
            </View>
          </Card.Content>
        </Card>,
      );
    }
  }, [modalVisible, isDelete, description, amount, recurs]);

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
            onPress={async () => await chevronSelect(true)}
            iconColor={theme.colors.onPrimaryContainer}
            disabled={checkIfCurrentMonth()}
            size={30}
          />
          <TouchableOpacity onPress={() => setIsPickerOpen(true)}>
            <Text style={styles.dateDisplay}>
              {format(selectedDate, 'MMMM yyyy')}
            </Text>
          </TouchableOpacity>
          <IconButton
            icon="chevron-right"
            onPress={async () => await chevronSelect(false)}
            iconColor={theme.colors.onPrimaryContainer}
            size={30}
          />
        </View>
      )}

      {isPickerOpen && (
        <MonthPicker
          locale="en"
          value={selectedDate}
          maximumDate={getMinDate()}
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
                title={`${consts.budgetMap[type]} - ${currencyFormatter(
                  ((netMonthlyIncome * getBudgetType(type)) / 100).toFixed(2),
                )} / ${currencyFormatter(
                  getBudgetAmounts(type as BudgetType) as string,
                )}`}
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
                      onPress={() => editAllocation(alloc)}
                      onLongPress={() => deleteAllocation(alloc)}
                    />
                  ))}
                <Button
                  icon="plus"
                  mode="text"
                  onPress={() => openAllocationModal(type)}
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
      {isIntro && (
        <View style={styles.saveContainer}>
          <Button
            mode="contained"
            icon={'check'}
            onPress={saveIntroBudget}
            style={{width: '100%'}}>
            Save
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
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
  saveContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  cardStyle: {
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 20,
  },
  button: {
    marginTop: 6,
    paddingVertical: 4,
    borderRadius: 25,
  },
  input: {
    marginBottom: 20,
    fontSize: 16,
  },
  contentContainer: {
  },
  alertText: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});
