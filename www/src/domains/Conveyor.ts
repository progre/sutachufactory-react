import { Operation } from '../commons/domains/apis';
import * as fareadjustmenter from '../commons/domains/fareadjustmenter';
import { OutsourcedFigure } from '../commons/domains/schemas';
import { FaceOfFigure, OperatingFigure } from '../commons/domains/types';

export default class Conveyor {
  private currentFigure: OperatingFigure | null;
  private finishedFigures: ReadonlyArray<OperatingFigure> = [];

  constructor(
    private waitingFigures: ReadonlyArray<OutsourcedFigure>,
  ) {
  }

  remaining() {
    return this.waitingFigures.length;
  }

  addIncomingFigures(figures: ReadonlyArray<OutsourcedFigure>) {
    this.waitingFigures = [...this.waitingFigures, ...figures];
  }

  getCurrentFaceOfFigure() {
    return toFaceOfFigure(this.currentFigure);
  }

  getFaceOfFigures() {
    const waitingFace: FaceOfFigure = {
      prone: this.waitingFigures[0].prone,
      special: this.waitingFigures[0].special,
      tail: 'notail',
    };
    return {
      waitingFace,
      currentFace: toFaceOfFigure(this.currentFigure),
      finishedFace: toFaceOfFigure(this.finishedFigures[0]),
      fadeOutFace: toFaceOfFigure(this.finishedFigures[1]),
    };
  }

  next() {
    if (this.waitingFigures.length <= 1) {
      // ロードが済んでないならやらない
      return;
    }
    if (this.currentFigure) {
      this.finishedFigures = [this.currentFigure, ...this.finishedFigures];
    }
    this.currentFigure = toOperatingFigure(this.waitingFigures[0]);
    this.waitingFigures = this.waitingFigures.slice(1);
  }

  attach() {
    if (!this.currentFigure) {
      throw new Error();
    }
    this.currentFigure = {
      ...this.currentFigure,
      actions: [...this.currentFigure.actions, 'attach'],
    };
  }

  flip() {
    if (!this.currentFigure) {
      throw new Error();
    }
    this.currentFigure = {
      ...this.currentFigure,
      actions: [...this.currentFigure.actions, 'flip'],
    };
  }

  ship(): ReadonlyArray<Operation> {
    const finished = this.finishedFigures;
    this.finishedFigures = [];
    return finished.map(x => ({ figureId: x.figure.figureId, actions: x.actions }));
  }
}

function toOperatingFigure(figure: OutsourcedFigure): OperatingFigure {
  return {
    figure,
    actions: [],
  };
}

function toFaceOfFigure(operating: OperatingFigure | null): FaceOfFigure | null {
  if (!operating) {
    return null;
  }
  return fareadjustmenter.toFaceOfFigure(
    operating.figure,
    operating.actions,
  );
}
