import { Profile2User } from 'iconsax-react-native';
import React from 'react';
import { Container, TextComponent } from '../../components';
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
      <TextComponent text="Js" />
    </Container>
  );
};

export default CartScreen;
