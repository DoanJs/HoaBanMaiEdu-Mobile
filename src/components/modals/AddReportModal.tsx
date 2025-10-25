import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../../constants/colors';
import { fontFamillies } from '../../constants/fontFamilies';
import { PlanModel } from '../../models';
import { usePlanStore } from '../../zustand/store';

interface Props {
  visible: boolean;
  onClose: () => void;
  planSelected: PlanModel | undefined;
  onChange: (val: PlanModel | undefined) => void;
}

export default function AddReportModal(props: Props) {
  const { visible, onClose, planSelected, onChange } = props;
  const { plans } = usePlanStore();
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (planSelected) {
      setSelected(planSelected.id);
    }
  }, [planSelected]);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setSelected(item.title);
        onChange(item);
        onClose()
      }}
    >
      <Text
        style={[
          styles.itemContent,
          {
            color: selected === item.id ? colors.green : '#333',
            fontFamily:
              selected === item.id
                ? fontFamillies.poppinsBold
                : fontFamillies.poppinsRegular,
          },
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

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
          <Text style={styles.headerText}>Chọn kế hoạch đã được duyệt</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>Đóng</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={plans.filter(plan => plan.status === 'approved')}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
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
});
