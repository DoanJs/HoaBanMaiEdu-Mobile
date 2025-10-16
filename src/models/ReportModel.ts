import { FieldValue } from '@react-native-firebase/firestore';
import { TimeAtModel } from '.';

export interface ReportModel {
  id: string;
  type: string;
  title: string;
  childId: string;
  teacherIds: string[];
  authorId: string;
  planId: string;
  status: string;
  comment: string;

  createAt: TimeAtModel | FieldValue;
  updateAt: TimeAtModel | FieldValue;
}
