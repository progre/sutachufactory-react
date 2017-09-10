import { calcSalaryOfFaceOfFigure } from '../commons/domains/accountant';
import { FaceOfFigure } from '../commons/domains/types';

export default class Result {
  productionVolume = 0;
  salary = 0;

  set(params: { productionVolume: number, salary: number }) {
    this.productionVolume = params.productionVolume;
    this.salary = params.salary;
  }

  add(current: FaceOfFigure | null) {
    if (!current) {
      return;
    }
    this.productionVolume += 1;
    this.salary += calcSalaryOfFaceOfFigure(current);
  }
}
