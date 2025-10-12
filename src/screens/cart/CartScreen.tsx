import { Profile2User } from 'iconsax-react-native';
import React from 'react';
import { FlatList } from 'react-native';
import {
  ButtonComponent,
  CartItemComponent,
  Container,
  RowComponent,
  SectionComponent,
  SpaceComponent,
} from '../../components';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

const CartScreen = () => {
  return (
    <Container
      bg={colors.primaryLight}
      title="NGUYỄN HOÀNG ĐĂNG (Bin)"
      right={
        <Profile2User
          size={sizes.title}
          color={colors.textBold}
          variant="Bold"
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
        <FlatList
          showsVerticalScrollIndicator={false}
          data={Array.from({ length: 10 })}
          renderItem={({ item, index }) => <CartItemComponent key={index} />}
          ListFooterComponent={
            <RowComponent justify="space-around">
              <ButtonComponent
                color='coral'
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
