import { Profile2User } from 'iconsax-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import {
  ButtonComponent,
  CartItemComponent,
  Container,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
} from '../../components';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import { useCartStore, useChildStore } from '../../zustand/store';

const CartScreen = ({navigation}: any) => {
  const { carts } = useCartStore();
  const { child } = useChildStore();
  const [title, setTitle] = useState('');

  if (!child) return <ActivityIndicator />;
  return (
    <Container
      bg={colors.primaryLight}
      title={child.fullName}
      uri={child.avatar}
      right={
        <Profile2User
          size={sizes.title}
          color={colors.textBold}
          variant="Bold"
          onPress={() => navigation.navigate('ChildrenScreen')}
        />
      }
    >
      <SectionComponent
        styles={{
          backgroundColor: colors.background,
          flex: 1,
          paddingVertical: 10,
        }}
      >
        <InputComponent
          styles={{
            backgroundColor: colors.background,
            borderRadius: 5,
          }}
          allowClear
          placeholder="Tên kế hoạch: "
          placeholderTextColor={colors.text}
          color={colors.gray}
          value={title}
          onChange={val => setTitle(val)}
        />

        <SpaceComponent height={10} />

        <FlatList
          showsVerticalScrollIndicator={false}
          data={carts}
          renderItem={({ item, index }) => <CartItemComponent key={item.id} index={index} cart={item} />}
          ListFooterComponent={
            <RowComponent justify="space-around">
              <ButtonComponent
                color="coral"
                text="Lưu nháp"
                onPress={() => {}}
                styles={{ flex: 1 }}
              />
              <SpaceComponent width={16} />
              <ButtonComponent
                color={colors.green}
                text="Gửi duyệt"
                onPress={() => {}}
                styles={{ flex: 1 }}
              />
            </RowComponent>
          }
        />
      </SectionComponent>
    </Container>
  );
};

export default CartScreen;
