import { Accept, InitialState, NewFigures, Operation } from '../commons/domains/apis';
import { HOST } from './repositorycommon';

export default class UserRepository {
  constructor(
    private userToken: string,
  ) {
  }

  async postName(name: string) {
    const params = {
      name,
      userToken: this.userToken,
    };
    await fetch(
      `${HOST}/name`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    );
  }

  async fetchInitialState(): Promise<InitialState> {
    const res = await fetch(`${HOST}/initialState/${this.userToken}`);
    return await res.json();
  }

  async fetchNextFigures() {
    const res = await fetch(`${HOST}/requestNewFigures/${this.userToken}`);
    const json: NewFigures = await res.json();
    return json.figures;
  }

  async postFigures(operations: ReadonlyArray<Operation>) {
    const params: Accept = {
      operations,
      userToken: this.userToken,
    };
    await fetch(
      `${HOST}/accept`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    );
  }
}
