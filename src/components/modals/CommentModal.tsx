import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { InputComponent } from '..';
import { colors } from '../../constants/colors';
import { useUserStore } from '../../zustand/store';
import { fontFamillies } from '../../constants/fontFamilies';

interface Props {
  visible: boolean;
  disable: boolean;
  value: string;
  comment: string;
  onClose: () => void;
  onChange: (val: string) => void;
  handleSaveComment: () => void;
}

export default function CommentModal(props: Props) {
  const { user } = useUserStore();
  const {
    visible,
    disable,
    value,
    comment,
    onClose,
    onChange,
    handleSaveComment,
  } = props;

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
          <Text style={styles.headerText}>
            Góp ý từ cô {comment.split('@Js@')[0]}:{' '}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>Đóng</Text>
          </TouchableOpacity>
        </View>

        <InputComponent
          styles={{
            backgroundColor: colors.background,
            paddingVertical: 12,
            borderRadius: 5,
          }}
          editable={['Phó Giám đốc', 'Giám đốc'].includes(
            user?.position as string,
          )}
          placeholder="Viết nhận xét"
          placeholderTextColor={colors.gray2}
          color={colors.background}
          value={value}
          multible
          numberOfLine={10}
          textStyles={{
            color: colors.text,
            textAlignVertical: 'top',
            minHeight: '40%',
            fontFamily: fontFamillies.poppinsRegular
          }}
          onChange={val => onChange(val)}
        />

        {['Phó Giám đốc', 'Giám đốc'].includes(user?.position as string) && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.button, styles.cancel]}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={
                disable
                  ? () => { }
                  : () => {
                    handleSaveComment();
                    onClose();
                  }
              }
              style={[
                styles.button,
                {
                  backgroundColor: disable ? colors.gray : colors.blue2,
                },
              ]}
            >
              <Text style={styles.buttonText}>Gửi</Text>
            </TouchableOpacity>
          </View>
        )}
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
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancel: {
    backgroundColor: '#ccc',
  },
  confirm: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
