import { Profile2User } from 'iconsax-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { Container, RowComponent, SectionComponent } from '../../components';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import { useChildStore, useFieldStore } from '../../zustand/store';
import FieldItemComponent from './FieldItemComponent.tsx';
import { getDocsData } from '../../constants/firebase/getDocsData.ts';

const TargetScreen = ({ navigation }: any) => {
  const { child } = useChildStore();
  const { fields, setFields } = useFieldStore();
  const [refreshing, setRefreshing] = useState(false); // loading khi kéo xuống

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      getDocsData({
        nameCollect: 'fields',
        setData: setFields,
      });
    } finally {
      setRefreshing(false);
    }
  }, []);

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
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
