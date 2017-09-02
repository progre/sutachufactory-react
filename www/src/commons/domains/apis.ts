import { OutsourcedFigure } from './schemas';

export type Ranking = ReadonlyArray<RankingEntry>;
type RankingEntry = { name: string; productionVolume: number; };

export interface GlobalStatus {
  totalSales: number;
  totalProduction: number;
  totalRanking: Ranking;
  hourlyRanking: Ranking;
}

export interface InitialState {
  figures: ReadonlyArray<OutsourcedFigure>;
  productionVolume: number;
  salary: number;
}

export interface NewFigures {
  figures: ReadonlyArray<OutsourcedFigure>;
}

export type Action = 'flip' | 'attach';

export interface Accept {
  readonly userToken: string;
  readonly operations: ReadonlyArray<Operation>;
}

export interface Operation {
  readonly figureId: string;
  readonly actions: ReadonlyArray<Action>;
}
