import { Subject } from 'rxjs';
import { GlobalStatus } from '../commons/domains/apis';
import * as cookie from '../infrastructures/cookierepository';
import * as repo from '../infrastructures/globalrepository';
import UserRepository from '../infrastructures/UserRepository';

export default class IndexApplication {
  globalStatusUpdated = new Subject<GlobalStatus>();

  start() {
    (async () => {
      const status = await repo.fetchGlobalStatus();
      this.globalStatusUpdated.next(status);
    })().catch((e) => { console.error(e.stack || e); });
  }

  getName() {
    return cookie.getName();
  }

  postName(name: string) {
    cookie.setName(name);
    new UserRepository(cookie.getOrCreateToken()).postName(name)
      .catch((e) => { console.error(e.stack || e); });
  }
}
