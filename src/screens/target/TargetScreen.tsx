import { QueryConstraint, where } from '@react-native-firebase/firestore';
import { Profile2User } from 'iconsax-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { Container, RowComponent, SectionComponent } from '../../components';
import { colors } from '../../constants/colors';
import { useFirestoreWithMetaCondition } from '../../constants/firebase/useFirestoreWithMetaCondition.ts';
import { sizes } from '../../constants/sizes';
import { CartModel } from '../../models/index.ts';
import {
  useCartStore,
  useChildStore,
  useFieldStore,
  useUserStore,
} from '../../zustand/store';
import FieldItemComponent from './FieldItemComponent.tsx';

const TargetScreen = ({ navigation }: any) => {
  const { child } = useChildStore();
  const { fields } = useFieldStore();
  const { user } = useUserStore();
  const { setCarts } = useCartStore();

  const { data: data_carts, loading: loading_carts } =
    useFirestoreWithMetaCondition({
      key: 'cartsCache',
      metaDoc: 'carts',
      id: user?.id,
      nameCollect: 'carts',
      condition: [
        where('teacherIds', 'array-contains', user?.id),
      ] as QueryConstraint[],
    });

  useEffect(() => {
    if (!loading_carts) {
      const items = data_carts as CartModel[];
      setCarts(items.filter(cart => cart.childId === child?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_carts, loading_carts]);

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
        styles={{ backgroundColor: colors.background, flex: 1, paddingTop: 10 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <RowComponent justify="space-around" styles={{ flexWrap: 'wrap' }}>
            {fields.map((_, index) => (
              <FieldItemComponent key={index} field={_} />
            ))}
          </RowComponent>
        </ScrollView>
      </SectionComponent>
    </Container>
  );
};

export default TargetScreen;
