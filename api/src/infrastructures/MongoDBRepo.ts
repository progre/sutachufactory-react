// 統計機能があるので気を使ったdbになる
// 現在（？）の総売上
// 現在（？）の売上総利益
// 0分更新で生産スピードによって常に動くように見せる
// 累計の生産数ランキング
// 直近1時間の生産数ランキング
//    データは5分単位とかでサーバー送信する
// 0分更新で15分前から1時間をカウント
// 復帰時の給与

// 生産物スキーマ
// product:${ユーザーId}:${figure|nature|udon}:${succeed|failure}: datetime
// 発注スキーマ
// outsourced-figure:${ユーザーId}:${fidure|nature|udon}:${prone|backward}

import { Db, MongoClient } from 'mongodb';
import { OutsourcedFigure, Product, User } from '../commons/domains/schemas';
import { DB } from './env';

export default class MongoDBRepo {
  static async create() {
    return new Promise<MongoDBRepo>((resolve, reject) => {
      MongoClient.connect(DB, async (err, db) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(new this(db));
      });
    });
  }

  private constructor(private db: Db) {
    Promise.all([
      this.db.collection('products').createIndex({ userToken: 1 }),
      this.db.collection('products').createIndex({ special: 1 }),
      this.db.collection('products').createIndex({ prone: 1 }),
      this.db.collection('products').createIndex({ tail: 1 }),
      this.db.collection('products').createIndex({ date: 1 }),
      this.db.collection('outsourcedFigures').createIndex({ figureId: 1 }),
      this.db.collection('users').createIndex({ userToken: 1 }),
    ]).catch((e) => { console.error(e.stack || e); });
  }

  async setUserName(user: User) {
    await this.db.collection('users').updateOne(
      { userToken: user.userToken },
      user,
      { upsert: true },
    );
  }

  async getUserName(userToken: string) {
    const item = await this.db.collection('users').findOne({ userToken });
    return (item || {}).name;
  }

  async addOutsourcedFigures(figures: ReadonlyArray<OutsourcedFigure>) {
    await this.db.collection('outsourcedFigures').insertMany(<any[]>figures);
  }

  async getOutsourcedFigures(userToken: string) {
    return <ReadonlyArray<OutsourcedFigure>>
      await this.db
        .collection('outsourcedFigures')
        .find({ userToken })
        .toArray();
  }

  async removeOutsourcedFigures(figureIds: string[]) {
    await this.db.collection('outsourcedFigures')
      // tslint:disable-next-line:object-literal-key-quotes
      .remove({ figureId: { '$in': figureIds } });
  }

  async putProducts(products: ReadonlyArray<Product>) {
    try {
      if (products.length <= 0) {
        return;
      }
      await this.db.collection('products').insertMany(<Product[]>products);
    } catch (e) {
      console.error(products);
      throw new Error(e);
    }
  }

  async getFigureStatus(userToken?: string, range?: { start?: Date; end: Date; }) {
    const products = this.db.collection('products');
    const userTokenQuery = userToken ? { userToken } : {};
    const dateQuery = !range ? {} : (() => {
      if (range.start) {
        return { date: { $gte: range.start.getTime(), $lt: range.end.getTime() } };
      } else {
        return { date: { $lt: range.end.getTime() } };
      }
    })();
    const [
      allFigures,
      validFigures,
      allNatures,
      validNatures,
      allUdons,
      validUdons,
    ] = await Promise.all([
      products
        .find({ ...userTokenQuery, ...dateQuery, special: '' })
        .count(),
      products
        .find({ ...userTokenQuery, ...dateQuery, special: '', tail: 'tail', prone: false })
        .count(),
      products
        .find({ ...userTokenQuery, ...dateQuery, special: 'nature' })
        .count(),
      products
        .find({ ...userTokenQuery, ...dateQuery, special: 'nature', tail: 'notail', prone: false })
        .count(),
      products
        .find({ ...userTokenQuery, ...dateQuery, special: 'udon' })
        .count(),
      products
        .find({ ...userTokenQuery, ...dateQuery, special: 'udon', tail: 'notail' })
        .count(),
    ]);
    return {
      validFigures,
      validNatures,
      validUdons,
      invalidFigures: allFigures - validFigures,
      invalidNatures: allNatures - validNatures,
      invalidUdons: allUdons - validUdons,
    };
  }

  async getAllUserStatuses(range: { start?: Date; end: Date; }) {
    const users: ReadonlyArray<User> = await this.db.collection('users')
      .find()
      .toArray();
    return Promise.all(
      users.map(async x => ({
        user: x,
        status: await this.getFigureStatus(x.userToken, range),
      })),
    );
  }
}
