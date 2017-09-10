try { require('source-map-support').install(); } catch (e) {/* NOP */ }
import * as React from 'react';
import IndexApplication from '../applications/IndexApplication';
import { Ranking } from '../commons/domains/apis';
import Root from '../components/index/Root';

const initialState = {
  totalSales: 0,
  totalProduction: 0,
  totalRanking: [] as Ranking,
  hourlyRanking: [] as Ranking,
  name: '',
};

export default class Index extends React.Component<{}, typeof initialState> {
  private app = new IndexApplication();

  constructor() {
    super();
    this.onNameChange = this.onNameChange.bind(this);

    this.state = initialState;
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      name: this.app.getName(),
    });
    this.app.globalStatusUpdated.subscribe((status) => {
      this.setState({
        ...this.state,
        ...status,
      });
    });
    this.app.start();
  }

  componentWillUnmount() {
    this.app.postName(this.state.name);
  }

  render() {
    return (
      <Root
        {...this.state}
        onNameChange={this.onNameChange}
      />
    );
  }

  private onNameChange(e: React.FocusEvent<HTMLInputElement>) {
    this.setState({ ...this.state, name: e.currentTarget.value });
  }
}
