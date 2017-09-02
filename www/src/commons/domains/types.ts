import { Action } from './apis';
import { OutsourcedFigure, Special, Tail } from './schemas';

export interface FaceOfFigure {
  readonly prone: boolean;
  readonly special: Special;
  readonly tail: Tail;
}

export interface OperatingFigure {
  readonly figure: OutsourcedFigure;
  readonly actions: ReadonlyArray<Action>;
}
