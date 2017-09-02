import { Action } from './apis';
import { OutsourcedFigure, Product, Tail } from './schemas';
import { FaceOfFigure } from './types';

export function toProduct(
  figure: OutsourcedFigure,
  actions: ReadonlyArray<Action>,
  date: Date,
): Product {
  return {
    ...toFaceOfFigure(figure, actions),
    userToken: figure.userToken,
    date: date.getTime(),
  };
}

export function toFaceOfFigure(
  figure: OutsourcedFigure,
  actions: ReadonlyArray<Action>,
): FaceOfFigure {
  let prone = figure.prone;
  let tail: Tail = 'notail';
  actions.forEach((action) => {
    switch (action) {
      case 'flip':
        if (figure.special === 'udon') {
          return;
        }
        prone = !prone;
        return;
      case 'attach':
        if (tail !== 'notail') {
          tail = 'notail';
          return;
        }
        tail = prone ? 'tail' : 'wrongtail';
        return;
      default:
        throw new Error(action);
    }
  });
  return {
    prone,
    tail,
    special: figure.special,
  };
}
