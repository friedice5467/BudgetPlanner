import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Portal, Modal,Text } from 'react-native-paper';
interface ModalContextType {
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = (content: ReactNode) => {
    setModalContent(content);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal, modalVisible, setModalVisible }}>
      {children}
      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal}>
            {modalContent ? modalContent : <Text>Amongus</Text>}
        </Modal>
      </Portal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
