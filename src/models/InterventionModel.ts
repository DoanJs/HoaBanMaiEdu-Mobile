import { TimeAtModel } from '.';

export interface InterventionModel {
  id: string;
  level: number;
  name: string;

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
