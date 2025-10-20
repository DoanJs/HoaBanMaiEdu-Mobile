import React, { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Container, RowComponent, SectionComponent } from '../../components';
import { colors } from '../../constants/colors';
import { getDocsData } from '../../constants/firebase/getDocsData.ts';
import { useChildStore, useFieldStore } from '../../zustand/store';
import FieldItemComponent from './FieldItemComponent.tsx';

const TargetScreen = () => {
  const insets = useSafeAreaInsets()
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
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <Container
        bg={colors.primaryLight}
        title={child.fullName}
        uri={child.avatar}
      >
        <SectionComponent
          styles={{ backgroundColor: colors.background, flex: 1, paddingTop: 10 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 80
            }}
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
    </SafeAreaView>
  );
};

export default TargetScreen;
