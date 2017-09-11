import { sync as uid } from 'uid-safe';
import { calcGrossMargin, calcSalary } from '../commons/domains/accountant';
import { GlobalStatus, InitialState, Operation } from '../commons/domains/apis';
import { toProduct } from '../commons/domains/fareadjustmenter';
import { OutsourcedFigure } from '../commons/domains/schemas';
import { createNew100Figures } from '../domains/figurefactory';
import MongoDBRepo from '../infrastructures/MongoDBRepo';
import RankingManager from './RankingManager';

const RELOAD_COUNT = 50;

export default class Application {

  static async create() {
    const repo = await MongoDBRepo.create();
    const rankingManager = await RankingManager.create(repo);
    return new this(repo, rankingManager);
  }

  private constructor(
    private repo: MongoDBRepo,
    private rankingManager: RankingManager,
  ) {
  }

  createToken() {
    return uid(16);
  }

  async setName(userToken: string, name: string) {
    await this.repo.setUserName({ userToken, name });
  }

  async initialState(userToken: string): Promise<InitialState> {
    let figures = await this.repo.getOutsourcedFigures(userToken);
    if (figures.length < RELOAD_COUNT) {
      figures = [...figures, ...await this.requestNewFigures(userToken)];
    }
    const counts = await this.repo.getFigureStatus(userToken);
    return {
      figures,
      productionVolume: counts.validFigures + counts.validNatures + counts.validUdons,
      salary: calcSalary(counts),
    };
  }

  async requestNewFigures(userToken: string) {
    const figures = createNew100Figures(userToken);
    await this.repo.addOutsourcedFigures(figures);
    return figures;
  }

  async accept(userToken: string, operations: ReadonlyArray<Operation>) {
    const now = new Date();
    const figures = await this.repo.getOutsourcedFigures(userToken);
    const products = operations
      .map(x => ({
        actions: x.actions,
        figure: <OutsourcedFigure>figures.find(y => y.figureId === x.figureId),
      }))
      .filter(x => x.figure)
      .map(x => toProduct(x.figure, x.actions, now));
    await Promise.all([
      this.repo.removeOutsourcedFigures(operations.map(x => x.figureId)),
      this.repo.putProducts(products),
    ]);
  }

  async globalStatus(): Promise<GlobalStatus> {
    const [counts, rankings] = await Promise.all([
      this.repo.getFigureStatus(),
      this.rankingManager.get(),
    ]);
    return {
      totalProduction: counts.validFigures + counts.validNatures + counts.validUdons,
      totalSales: calcGrossMargin(counts),
      totalRanking: rankings.totalRanking,
      hourlyRanking: rankings.hourlyRanking,
    };
  }
}
