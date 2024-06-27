import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Portal, Modal,Text,ActivityIndicator } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
interface ModalContextType {
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  isLoading: boolean;
  setLoadingState: (loading: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDismissable, setModalDismissable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`)
  }, [isLoading]);

  const showModal = (content: ReactNode) => {
    setModalContent(content);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setModalContent(null);
  };

  const showUndismissableModal = () => {
    setModalVisible(true);
    setModalDismissable(false);
  }

  const hideUndismissableModal = () => {
    setModalVisible(false);
    setModalContent(null);
    setModalDismissable(true);
  }

  const setLoadingState = (loading: boolean) => {
    setModalContent(<ActivityIndicator size="large" color={theme.colors.primary} />)
    setIsLoading(loading);
  }

  return (
    <ModalContext.Provider value={{ showModal, hideModal, modalVisible, setModalVisible, isLoading, setLoadingState }}>
      {children}
      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal} dismissable={modalDismissable}>
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
