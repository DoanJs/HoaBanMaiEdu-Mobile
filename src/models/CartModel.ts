import { FieldValue } from '@react-native-firebase/firestore';
import { TimeAtModel } from '.';

export interface CartModel {
  id: string;
  fieldId: string;
  level: number;
  name: string;
  targetId: string;

  content: string;
  intervention: string;
  childId: string;
  teacherIds: string[];
  authorId: string;

  createAt: TimeAtModel | FieldValue;
  updateAt: TimeAtModel | FieldValue;
}
