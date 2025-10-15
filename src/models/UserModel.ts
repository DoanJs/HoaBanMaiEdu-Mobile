import { FieldValue } from '@react-native-firebase/firestore';
import { TimeAtModel } from '.';

export interface UserModel {
  id: string; //nhớ tự customID khi tạo user mới
  fullName: string;
  shortName: string;
  email: string;
  phone: string;
  avatar: string;
  birth: string;
  role: string;
  position: string;

  createAt: TimeAtModel | FieldValue;
  updateAt: TimeAtModel | FieldValue;
}
