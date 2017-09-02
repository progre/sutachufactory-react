import { sync as uid } from 'uid-safe';
import { OutsourcedFigure, Special } from '../commons/domains/schemas';

export function createNew100Figures(userToken: string): ReadonlyArray<OutsourcedFigure> {
  const items: OutsourcedFigure[] = [];
  // tslint:disable-next-line:no-increment-decrement
  for (let i = 0; i < 100; i++) {
    items.push(createRandomizedFigure(userToken));
  }
  return items;
}

function createRandomizedFigure(userToken: string): OutsourcedFigure {
  // tslint:disable-next-line:insecure-random
  const specialRandom = Math.random();
  let special: Special;
  if (specialRandom < 0.001) {
    special = 'nature';
  } else if (specialRandom < 0.01) {
    special = 'udon';
  } else {
    special = '';
  }
  return {
    userToken,
    special,
    figureId: uid(16),
    // tslint:disable-next-line:insecure-random
    prone: Math.random() < 0.9,
  };
}
