import { Subject } from 'rxjs';
import { calcSalaryOfFaceOfFigure } from '../commons/domains/accountant';
import Conveyor from '../domains/Conveyor';
import { getOrCreateToken } from '../infrastructures/cookierepository';
import UserRepository from '../infrastructures/UserRepository';

const RELOAD_COUNT = 50;

export default class WorkApplication {
  productionVolume = 0;
  salary = 0;
  readonly conveyorMovingMiliseconds = 250;
  conveyor: Conveyor;
  private conveyorMoving = false;
  private repo: UserRepository;
  private intervalTimer: NodeJS.Timer;

  readonly currentFaceOfFiguresChanged = new Subject<void>();
  readonly conveyorMoved = new Subject<void>();

  start() {
    this.repo = new UserRepository(getOrCreateToken());
    this.intervalTimer = setInterval(
      () => {
        this.ship().catch((e) => { console.error(e.stack || e); });
      },
      5 * 60 * 1000,
    );
    (async () => {
      const storedState = await this.repo.fetchInitialState();
      this.productionVolume = storedState.productionVolume;
      this.salary = storedState.salary;
      this.conveyor = new Conveyor(storedState.figures);
      this.conveyorMoved.next();
      await new Promise((resolve) => {
        setTimeout(resolve, this.conveyorMovingMiliseconds);
      });
      await this.moveConveyor();
    })().catch((e) => { console.error(e.stack || e); });
  }

  end() {
    clearInterval(this.intervalTimer);
    (async () => {
      await this.ship();
    })().catch((e) => { console.error(e.stack || e); });
  }

  pushKey(code: 'Enter' | 'KeyZ' | 'KeyX') {
    if (this.conveyorMoving) {
      return;
    }
    this.keyEventLoop(code).catch((e) => { console.error(e.stack || e); });
  }

  private async keyEventLoop(code: 'Enter' | 'KeyZ' | 'KeyX') {
    switch (code) {
      case 'Enter':
        await this.moveConveyor();
        return;
      case 'KeyZ':
        this.attach();
        return;
      case 'KeyX':
        this.flip();
        return;
      default:
        throw new Error(code);
    }
  }

  private async moveConveyor() {
    this.conveyorMoving = true;
    this.subtotal();
    this.conveyor.next();
    this.conveyorMoved.next();
    await Promise.all([
      (async () => {
        if (this.conveyor.remaining() >= RELOAD_COUNT) {
          return;
        }
        const figures = await this.repo.fetchNextFigures();
        this.conveyor.addIncomingFigures(figures);
      })(),
      new Promise((resolve) => {
        setTimeout(resolve, this.conveyorMovingMiliseconds);
      }),
    ]);
    this.conveyorMoving = false;
  }

  private attach() {
    this.conveyor.attach();
    this.currentFaceOfFiguresChanged.next();
  }

  private flip() {
    this.conveyor.flip();
    this.currentFaceOfFiguresChanged.next();
  }

  private async ship() {
    await this.repo.postFigures(this.conveyor.ship());
  }

  private subtotal() {
    const current = this.conveyor.getCurrentFaceOfFigure();
    if (!current) {
      return;
    }
    this.productionVolume += 1;
    this.salary += calcSalaryOfFaceOfFigure(current);
  }
}
