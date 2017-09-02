export type Special = 'nature' | 'udon' | '';
export type Tail = 'notail' | 'wrongtail' | 'tail';

export interface Product {
  readonly userToken: string;
  readonly special: Special;
  readonly prone: boolean;
  readonly tail: Tail;
  readonly date: number;
}

export interface OutsourcedFigure {
  readonly figureId: string;
  readonly userToken: string;
  readonly prone: boolean;
  readonly special: Special;
}

export interface User {
  readonly userToken: string;
  readonly name: string;
}
