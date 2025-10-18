import { serverTimestamp } from '@react-native-firebase/firestore';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { TextComponent } from '.';
import { colors } from '../constants/colors';
import { addDocData } from '../constants/firebase/addDocData';
import { deleteDocData } from '../constants/firebase/deleteDocData';
import { fontFamillies } from '../constants/fontFamilies';
import { PlanTaskModel, TargetModel } from '../models';
import { useCartStore, useChildStore, useUserStore } from '../zustand/store';

interface Props {
  target: TargetModel;
  setIsLoading: any;
  planTasks: PlanTaskModel[];
}

const TargetItemComponent = (props: Props) => {
  const { target, setIsLoading, planTasks } = props;
  const { user } = useUserStore();
  const { child } = useChildStore();
  const { carts, removeCart, addCart } = useCartStore();

  const showSelected = () => {
    let status: boolean = false;
    const index = carts.findIndex(cart => cart.targetId === target.id);
    if (index === -1) {
      status = false;
    } else {
      status = true;
    }

    return status;
  };
  const isSelectedTarget = () => {
    let isSelected: boolean = false;
    const index = planTasks.findIndex(
      planTask => planTask.targetId === target.id,
    );
    if (index !== -1) {
      isSelected = true;
    } else {
      isSelected = false;
    }

    return isSelected;
  };
  const handleSelected = async () => {
    if (user && child) {
      const index = carts.findIndex(cart => cart.targetId === target.id);
      if (index !== -1) {
        setIsLoading(true);
        removeCart(carts[index].id);
        await deleteDocData({
          nameCollect: 'carts',
          id: carts[index].id,
          metaDoc: 'carts',
        });
        setIsLoading(false);
      } else {
        setIsLoading(true);
        addDocData({
          nameCollect: 'carts',
          value: {
            targetId: target.id,
            level: target.level,
            name: target.name,
            fieldId: target.fieldId,

            content: '',
            intervention: '',
            childId: child.id,
            teacherIds: child.teacherIds,
            authorId: user.id,

            createAt: serverTimestamp(),
            updateAt: serverTimestamp(),
          },
          metaDoc: 'carts',
        }).then((result: any) => {
          setIsLoading(false);
          addCart({
            ...target,
            id: result.id,
            targetId: target.id,
            content: '',
            intervention: '',
            childId: child.id,
            teacherIds: child.teacherIds,
            author: user.id,

            createAt: serverTimestamp(),
            updateAt: serverTimestamp(),
          });
        });
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSelected}
      style={{
        borderWidth: 1,
        borderColor: colors.primary + '80',
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
        backgroundColor: showSelected()
          ? colors.primary + '80'
          : colors.background,
      }}
    >
      <TextComponent
        styles={{
          textAlign: 'justify',
          color: isSelectedTarget() ? colors.orange : colors.text,
        }}
        text={target.name}
      />
      <TextComponent
        styles={{ color: isSelectedTarget() ? colors.orange : colors.text }}
        text={`Level: ${target.level}`}
        font={fontFamillies.poppinsBold}
      />
    </TouchableOpacity>
  );
};

export default TargetItemComponent;
