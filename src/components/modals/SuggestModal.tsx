import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { SearchComponent, SpaceComponent } from '..';
import { colors } from '../../constants/colors';
import { fontFamillies } from '../../constants/fontFamilies';
import { useSuggestStore } from '../../zustand/store';

interface Props {
  visible: boolean;
  onClose: () => void;
  cart: any;
  content: string;
  onChange: (val: string) => void;
}

export default function SuggestModal(props: Props) {
  const { visible, onClose, cart, content, onChange } = props;
  const { suggests } = useSuggestStore();
  const [suggestNews, setSuggestNews] = useState<any[]>([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (suggests.length > 0 && cart) {
      setSuggestNews(
        suggests.filter(suggest => suggest.fieldId === cart.fieldId),
      );
    }
  }, [suggests, cart]);
  useEffect(() => {
    if (content) {
      setSelected(content);
    }
  }, [content]);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setSelected(item.name);
        onChange(item.name);
      }}
    >
      <Text
        style={[
          styles.itemContent,
          {
            color: selected === item.name ? colors.green : '#333',
            fontFamily:
              selected === item.name
                ? fontFamillies.poppinsBold
                : fontFamillies.poppinsRegular,
          },
        ]}
      >
        {item.name}
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
          <Text style={styles.headerText}>Gợi ý</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>Đóng</Text>
          </TouchableOpacity>
        </View>

        <SearchComponent
          arrSource={suggests.filter(
            suggest => suggest.fieldId === cart.fieldId,
          )}
          onChange={val => setSuggestNews(val)}
          placeholder="Nhập gợi ý"
          type="searchSuggest"
        />

        <SpaceComponent height={10} />
        <FlatList
          data={suggestNews}
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
