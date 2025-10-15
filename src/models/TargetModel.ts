import { TimeAtModel } from ".";

export interface TargetModel {
  id: string;
  fieldId: string;
  name: string;
  level: number;

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
