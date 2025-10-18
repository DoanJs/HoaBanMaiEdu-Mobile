import { Trash } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import {
  InputComponent,
  RowComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from '.';
import { colors } from '../constants/colors';
import { convertTargetField } from '../constants/convertTargetAndField';
import { deleteDocData } from '../constants/firebase/deleteDocData';
import { fontFamillies } from '../constants/fontFamilies';
import { sizes } from '../constants/sizes';
import { useCartStore, useFieldStore, useTargetStore } from '../zustand/store';
import { InterventionModal, SuggestModal } from './modals';

interface Props {
  index: number;
  cart: any;
}

const CartItemComponent = (props: Props) => {
  const { index, cart } = props;
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();
  const { editCart, removeCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [intervention, setIntervention] = useState('');
  const [isVisibleSuggest, setIsVisibleSuggest] = useState(false);
  const [isVisibleIntervention, setIsVisibleIntervention] = useState(false);

  useEffect(() => {
    if (cart && cart.content) {
      setContent(cart.content);
      setIntervention(cart.intervention);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);
  useEffect(() => {
    if (content) {
      editCart(cart.id, { ...cart, content });
    }
  }, [content]);
  useEffect(() => {
    if (intervention) {
      editCart(cart.id, { ...cart, intervention });
    }
  }, [intervention]);

  const removeCartItem = () => {
    removeCart(cart.id);
    setIsLoading(true);
    deleteDocData({ nameCollect: 'carts', id: cart.id, metaDoc: 'carts' })
      .then(() => setIsLoading(false))
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const renderRightActions = () => (
    <TouchableOpacity style={styles.actionBox} onPress={removeCartItem}>
      <Trash size={sizes.extraTitle} color={colors.red} variant="Bold" />
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.textBold,
          borderRadius: 10,
          padding: 10,
          marginBottom: 10,
        }}
      >
        <RowComponent justify="space-between">
          <TextComponent
            text={`${index + 1}. ${
              convertTargetField(cart.targetId, targets, fields).nameField
            }`}
            size={sizes.subText}
            font={fontFamillies.poppinsBold}
          />
          <TextComponent
            text={`Level ${cart.level}`}
            size={sizes.subText}
            font={fontFamillies.poppinsBold}
          />
        </RowComponent>
        <TextComponent
          styles={{ textAlign: 'justify' }}
          text={cart.name}
          size={sizes.subText}
        />

        <RowComponent justify="space-between">
          <TouchableOpacity
            style={{ flex: 2 }}
            onPress={() => setIsVisibleIntervention(true)}
          >
            <TextComponent
              text={intervention ? intervention : 'Chọn mức độ hỗ trợ'}
              size={sizes.smallText}
              styles={{
                backgroundColor: colors.blueLight,
                padding: 10,
                borderRadius: 10,
                textAlign: 'center',
                fontFamily: fontFamillies.poppinsBold,
              }}
            />
          </TouchableOpacity>
          <SpaceComponent width={16} />
          <TouchableOpacity onPress={() => setIsVisibleSuggest(true)}>
            <TextComponent
              text="Gợi ý nội dung"
              size={sizes.smallText}
              styles={{
                backgroundColor: colors.green,
                padding: 10,
                borderRadius: 10,
                textAlign: 'center',
                fontFamily: fontFamillies.poppinsBold,
              }}
            />
          </TouchableOpacity>
        </RowComponent>

        <SpaceComponent height={10} />

        <InputComponent
          textStyles={{
            textAlignVertical: 'top',
            minHeight: 120,
          }}
          placeholder="Nội dung khác"
          value={content}
          onChange={val => setContent(val)}
          multible
          numberOfLine={4}
        />

        <SuggestModal
          content={content}
          visible={isVisibleSuggest}
          onClose={() => setIsVisibleSuggest(false)}
          onChange={val => setContent(val)}
          cart={cart}
        />
        <InterventionModal
          intervention={intervention}
          visible={isVisibleIntervention}
          onClose={() => setIsVisibleIntervention(false)}
          onChange={val => setIntervention(val)}
        />
      </View>

      <SpinnerComponent loading={isLoading} />
    </Swipeable>
  );
};

export default CartItemComponent;
const styles = StyleSheet.create({
  dropdown: { backgroundColor: colors.blueLight },
  dropdownContainer: { backgroundColor: colors.background },
  actionBox: {
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
    borderRadius: 10,
    marginBottom: 10,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
