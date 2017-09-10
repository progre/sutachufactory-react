import * as schedule from 'node-schedule';
import { sync as uid } from 'uid-safe';
import { calcGrossMargin, calcSalary } from '../commons/domains/accountant';
import { GlobalStatus, InitialState, Operation } from '../commons/domains/apis';
import { toProduct } from '../commons/domains/fareadjustmenter';
import { OutsourcedFigure } from '../commons/domains/schemas';
import { createNew100Figures } from '../domains/figurefactory';
import Repository from '../infrastructures/Repository';

const RELOAD_COUNT = 50;

export default class Application {
  private repo: Repository;
  private totalRanking: ReadonlyArray<{ name: string; productionVolume: number; }> = [];
  private hourlyRanking: ReadonlyArray<{ name: string; productionVolume: number; }> = [];

  constructor() {
    (async () => {
      this.repo = await Repository.create();
      this.updateRankings().catch((e) => { console.error(e.stack || e); });
      schedule.scheduleJob('0 * * * *', () => {
        this.updateRankings().catch((e) => { console.error(e.stack || e); });
      });
    })().catch((e) => { console.error(e.stack || e); });
  }

  private async updateRankings() {
    // ランキングは毎時0分、15分前からのデータを対象にする
    const now = new Date();
    const end = new Date(now.getTime() - 15 * 60 * 1000);
    const start = new Date(end.getTime() - 1 * 60 * 60 * 1000);
    await Promise.all([
      (async () => {
        this.totalRanking = await this.createRanking({ end });
      })(),
      (async () => {
        this.hourlyRanking = await this.createRanking({ start, end });
      })(),
    ]);
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
    const counts = await this.repo.getFigureStatus();
    return {
      totalProduction: counts.validFigures + counts.validNatures + counts.validUdons,
      totalSales: calcGrossMargin(counts),
      totalRanking: this.totalRanking,
      hourlyRanking: this.hourlyRanking,
    };
  }

  async createRanking(range: { start?: Date; end: Date; }) {
    const allUserStatuses = await this.repo.getAllUserStatuses(range);
    return allUserStatuses.map(x => ({
      name: x.user.name,
      productionVolume: x.status.validFigures + x.status.validNatures + x.status.validUdons,
    }))
      .filter(x => x.productionVolume > 0)
      .concat()
      .sort(x => -x.productionVolume)
      .slice(0, 10);
  }
}
