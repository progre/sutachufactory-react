import { Subject } from 'rxjs';
import Conveyor from '../domains/Conveyor';
import Result from '../domains/Result';
import { getOrCreateToken } from '../infrastructures/cookierepository';
import UserRepository from '../infrastructures/UserRepository';

const RELOAD_COUNT = 50;

export default class WorkApplication {
  readonly conveyorMovingMiliseconds = 250;
  readonly priorInputMiliseconds = 100;
  conveyor: Conveyor;
  result = new Result();
  private conveyorMoving = false;
  private inputable = true;
  private repo: UserRepository;
  private keyboardCodeQueue: ReadonlyArray<'Enter' | 'KeyZ' | 'KeyX'> = [];
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
    this.initializeConveyor().catch((e) => { console.error(e.stack || e); });
  }

  end() {
    clearInterval(this.intervalTimer);
    this.ship().catch((e) => { console.error(e.stack || e); });
  }

  private async initializeConveyor() {
    const storedState = await this.repo.fetchInitialState();
    this.result.set(storedState);
    this.conveyor = new Conveyor(storedState.figures);
    this.conveyorMoved.next();
    await new Promise((resolve) => {
      setTimeout(resolve, this.conveyorMovingMiliseconds);
    });
    await this.moveConveyor();
  }

  pushKey(code: 'Enter' | 'KeyZ' | 'KeyX') {
    if (!this.inputable || this.keyboardCodeQueue.indexOf('Enter') >= 0) {
      return;
    }
    this.keyboardCodeQueue = [...this.keyboardCodeQueue, code];
    if (this.conveyorMoving) {
      return;
    }
    this.doKeyEventLoop().catch((e) => { console.error(e.stack || e); });
  }

  private async doKeyEventLoop() {
    this.keyboardCodeQueue.forEach((x) => { this.doKeyEvent(x); });
    const next = this.keyboardCodeQueue.indexOf('Enter') >= 0;
    this.keyboardCodeQueue = [];
    if (!next) {
      return;
    }
    await this.moveConveyor();
  }

  private doKeyEvent(code: 'Enter' | 'KeyZ' | 'KeyX') {
    switch (code) {
      case 'Enter': return;
      case 'KeyZ': this.attach(); return;
      case 'KeyX': this.flip(); return;
      default: throw new Error(code);
    }
  }

  private async moveConveyor() {
    this.conveyorMoving = true;
    this.inputable = false;
    this.result.add(this.conveyor.getCurrentFaceOfFigure());
    this.conveyor.next();
    this.conveyorMoved.next();
    setTimeout(
      () => { this.inputable = true; },
      this.conveyorMovingMiliseconds - this.priorInputMiliseconds,
    );
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
    await this.doKeyEventLoop();
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
}
