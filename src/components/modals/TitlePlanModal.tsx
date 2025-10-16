import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Modal from 'react-native-modal';
import { InputComponent } from '..';
import { colors } from '../../constants/colors';

interface Props {
  visible: boolean
  title: string
  setTitle: any
  onClose: () => void
  onChange: (val: string) => void
}

export default function TitlePlanModal(props: Props) {
  const { visible, title, setTitle, onClose, onChange } = props

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}
    >
      <View style={styles.modalBox}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Thêm tên kế hoạch</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>Đóng</Text>
          </TouchableOpacity>
        </View>

        <InputComponent
          styles={{
            backgroundColor: colors.background,
            paddingVertical: 12,
            paddingHorizontal: 26,
            borderRadius: 5,
          }}
          placeholder='Tên kế hoạch'
          placeholderTextColor={colors.gray}
          color={colors.background}
          value={title}
          textStyles={{
            color: colors.text,
          }}
          onChange={val => {
            onChange(val)
            setTitle(val)
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 0, // bỏ khoảng trống mặc định
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    maxHeight: '85%', // tránh tràn màn hình
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    color: '#007AFF',
    fontSize: 16,
  },
  item: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#eee',
  },
  confirmBtn: {
    backgroundColor: '#007bff',
  },
  cancelText: {
    color: '#333',
    fontWeight: '500',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});
