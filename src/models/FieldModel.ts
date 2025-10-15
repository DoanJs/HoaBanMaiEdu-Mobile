import { TimeAtModel } from ".";

export interface FieldModel {
  id: string;
  name: string

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
