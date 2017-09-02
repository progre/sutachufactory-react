import { FaceOfFigure } from './types';

// すたちゅー売上 +100
// 原材料費      - 10
// 全体の人件費   - 40

// 不良品はカウントしない（損失を従業員に補填させるため）
// オプション
// natureの場合は原価0
// うどんの場合原価0売上500

export function calcGrossMargin(counts: {
  validFigures: number;
  validNatures: number;
  validUdons: number;
}) {
  return counts.validFigures * 50
    + counts.validNatures * 60
    + counts.validUdons * 450;
}

export function calcSalary(counts: {
  validFigures: number;
  invalidFigures: number;
  validNatures: number;
  invalidNatures: number;
  validUdons: number;
  invalidUdons: number;
}) {
  return counts.validFigures + counts.validNatures + counts.validUdons
    - counts.invalidFigures * 49
    - (counts.invalidNatures + counts.invalidUdons) * 39;
}

export function calcSalaryOfFaceOfFigure(figure: FaceOfFigure) {
  switch (figure.special) {
    case '':
      return !figure.prone && figure.tail === 'tail' ? 1 : -49;
    case 'nature':
    return !figure.prone && figure.tail === 'notail' ? 1 : -39;
    case 'udon':
      return figure.tail === 'notail' ? 1 : -39;
    default:
      throw new Error();
  }
}
