import { useState, useEffect } from 'react';
import { useModal } from '../contexts/ModalContext';
import { StyleSheet } from 'react-native';
import { useTheme, Card, TextInput, Button } from 'react-native-paper';
import { useAlerts } from 'react-native-paper-alerts';
export const useOpenPercentageSlider = () => {
  const { showModal, hideModal } = useModal();
  const theme = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [percentageSetter, setPercentageSetter] = useState<Function | null>(null);
  const alerts = useAlerts();

  const validateInput = (value: string) => {
    if (value === '') {
      alerts.alert('Error', 'Please enter a value');
      return false;
    }
    if (isNaN(parseFloat(value))) {
      alerts.alert('Error', 'Please enter a valid number');
      return false;
    }
    if (parseFloat(value) < 0 || parseFloat(value) > 100) {
      alerts.alert('Error', 'Value must be between 0 and 100');
      return false;
    }
    return true;
  }

  useEffect(() => {
    if (isModalOpen) {
      showModal(
        <Card style={styles.cardStyle}>
          <Card.Content>
            <TextInput
              label="Percentage"
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.input}
            />
            <Button
              mode="contained"
              icon="check"
              textColor={theme.colors.onPrimaryContainer}
              onPress={() => {
                percentageSetter && validateInput(inputValue) && percentageSetter(parseFloat(inputValue));
                hideModal();
                setIsModalOpen(false); 
              }}
              style={styles.button}>
              Confirm
            </Button>
          </Card.Content>
        </Card>
      );
    }
  }, [isModalOpen, inputValue]); 

  const openPercentageSlider = (label: string, currVal: string, setValue: (value: number) => void) => {
    setInputValue(currVal);
    setPercentageSetter(() => setValue);
    setIsModalOpen(true); 
  };

  return openPercentageSlider;
};

const styles = StyleSheet.create({
  cardStyle: {
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  input: {
    marginBottom: 20,
    fontSize: 16,
  },
});
