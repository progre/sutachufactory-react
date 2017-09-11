import { Ranking } from '../commons/domains/apis';
import MongoDBRepo from '../infrastructures/MongoDBRepo';

export default class RankingManager {
  private updating = false;
  static async create(mongoDBRepo: MongoDBRepo) {
    const [totalRanking, hourlyRanking]
      = await updateRankings(mongoDBRepo);
    return new this(mongoDBRepo, totalRanking, hourlyRanking, new Date());
  }

  private constructor(
    private mongoDBRepo: MongoDBRepo,
    private totalRanking: Ranking,
    private hourlyRanking: Ranking,
    private lastUpdated: Date,
  ) {
  }

  async get() {
    if (this.updating) {
      return {
        totalRanking: this.totalRanking,
        hourlyRanking: this.hourlyRanking,
      };
    }
    const now = new Date();
    if (this.lastUpdated.getUTCHours() === now.getUTCHours()) {
      return {
        totalRanking: this.totalRanking,
        hourlyRanking: this.hourlyRanking,
      };
    }
    this.updating = true;
    process.stdout.write('Ranking updating...\n');
    [this.totalRanking, this.hourlyRanking]
      = await updateRankings(this.mongoDBRepo);
    process.stdout.write(
      `done! totalRanking: ${this.totalRanking.length},`
      + ` hourlyRanking: ${this.hourlyRanking.length}` + '\n',
    );
    this.lastUpdated = now;
    this.updating = false;
    return {
      totalRanking: this.totalRanking,
      hourlyRanking: this.hourlyRanking,
    };
  }
}

async function updateRankings(mongoDBRepo: MongoDBRepo) {
  // ランキングは毎時0分、15分前からのデータを対象にする
  const now = new Date();
  const end = new Date(now.getTime() - 15 * 60 * 1000);
  const start = new Date(end.getTime() - 1 * 60 * 60 * 1000);
  return Promise.all([
    createRanking(mongoDBRepo, { end }),
    createRanking(mongoDBRepo, { start, end }),
  ]);
}

async function createRanking(
  mongoDBRepo: MongoDBRepo,
  range: { start?: Date; end: Date; },
) {
  const allUserStatuses = await mongoDBRepo.getAllUserStatuses(range);
  return allUserStatuses.map(x => ({
    name: x.user.name.length <= 0 ? '名無しさん' : x.user.name,
    productionVolume: x.status.validFigures + x.status.validNatures + x.status.validUdons,
  }))
    .filter(x => x.productionVolume > 0)
    .concat()
    .sort(x => -x.productionVolume)
    .slice(0, 10);
}
