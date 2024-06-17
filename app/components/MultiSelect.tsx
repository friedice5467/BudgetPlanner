import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Chip, TextInput, Button} from 'react-native-paper';
import {useTheme} from 'react-native-paper';

export interface Item {
  id: number;
  name: string;
}

interface MultiSelectProps {
    items: Item[];
    onSelectionChange: (selectedItems: Item[]) => void;
    selectedItems: Item[];
    selectText: string;
    searchInputPlaceholderText: string;
    tagRemoveIconColor: string;
    tagBorderColor: string;
    tagTextColor: string;
    selectedItemTextColor: string;
    selectedItemIconColor: string;
    itemTextColor: string;
    displayKey: string;
    containerColor: string;
    submitButtonColor: string;
    submitButtonText: string;
  }
  
  const MultiSelect: React.FC<MultiSelectProps> = ({
    items,
    onSelectionChange,
    selectedItems,
    selectText,
    searchInputPlaceholderText,
    tagRemoveIconColor,
    tagBorderColor,
    tagTextColor,
    selectedItemTextColor,
    selectedItemIconColor,
    itemTextColor,
    displayKey,
    containerColor,
    submitButtonColor,
    submitButtonText,
  }) => {
    const theme = useTheme();
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
  
    const toggleSelection = (item: Item) => {
      const isSelected = selectedItems.some(selectedItem => selectedItem.id === item.id);
      const newSelectedItems = isSelected
        ? selectedItems.filter(selectedItem => selectedItem.id !== item.id)
        : [...selectedItems, item];
      onSelectionChange(newSelectedItems);
    };
  
    const renderListItem = ({ item }: { item: Item }) => (
        <TouchableOpacity onPress={() => toggleSelection(item)} style={styles.listItem}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: selectedItems.some(si => si.id === item.id) ? selectedItemTextColor : itemTextColor }}>
              {item.name}
            </Text>
            {selectedItems.some(si => si.id === item.id) && (
              <Text style={{ color: selectedItemIconColor }}>✓</Text>  
            )}
          </View>
        </TouchableOpacity>
      );
      
  
    const filteredItems = items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={[styles.button]}>
        <Button
          icon="plus"
          buttonColor={theme.colors.backdrop}
          textColor="white">
          <Text>{selectText}</Text>
        </Button>
      </TouchableOpacity>
      <FlatList
        data={selectedItems}
        renderItem={({ item }) => (
          <Chip
            key={item.id.toString()}
            onClose={() => toggleSelection(item)}
            style={{ backgroundColor: tagBorderColor, margin: 4 }}
            textStyle={{ color: tagTextColor }}>
            {item.name}
          </Chip>
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipContainer}
      />
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
        transparent={true}>
        <View style={styles.modalContent}>
          <View style={{flex: 0.1, flexDirection: 'row'}}>
            <TextInput
              left={
                <TextInput.Icon icon="magnify" color={theme.colors.primary} />
              }
              right={
                <TextInput.Icon
                  icon="close"
                  size={20}
                  onPress={() => setVisible(false)}
                />
              }
              placeholder={searchInputPlaceholderText}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[styles.searchInput, {flex: 1}]}
            />
          </View>
          <View style={{flex: 0.8, paddingBottom: 5}}>
            <FlatList
              data={filteredItems}
              renderItem={renderListItem}
              keyExtractor={item => item.id.toString()}
            />
          </View>
          <View style={{flex: 0.1}}>
            <Button
              onPress={() => setVisible(false)}
              textColor="white"
              style={[
                styles.closeButton,
                {backgroundColor: submitButtonColor},
              ]}>
              {submitButtonText}
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  button: {
    padding: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: '100%',
  },
  searchInput: {
    backgroundColor: 'white',
  },
  closeButton: {
    borderRadius: 20,
    color: 'white',
    paddingVertical: 5,
    marginTop: 22,
  },
  chipContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
});

export default MultiSelect;
