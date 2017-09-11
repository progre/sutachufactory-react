import * as React from 'react';
import { Ranking as RankingType } from '../../commons/domains/apis';
import Header from '../Header';
import Manual from './Manual';
import Menu from './Menu';
import PopupWindow from './PopupWindow';
import Ranking from './Ranking';

interface Props {
  totalSales: number;
  totalProduction: number;
  totalRanking: RankingType;
  hourlyRanking: RankingType;
  name: string;
  onNameChange(e: React.FocusEvent<HTMLInputElement>): void;
}

const initialState = {
  isShowingManual: false,
  isShowingRanking: false,
};

export default class Root extends React.Component<Props, typeof initialState> {

  constructor() {
    super();
    this.onManualClick = this.onManualClick.bind(this);
    this.onRankingClick = this.onRankingClick.bind(this);

    this.state = initialState;
  }

  render() {
    const props = this.props;
    return (
      <div style={{ display: 'flex' }}>
        <Header />
        <div
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
          }}
        >
          <h1
            style={{
              textAlign: 'center',
              fontSize: 80,
            }}
          >
            すたちゅー工場
          </h1>
          <GlobalStatus
            totalProduction={props.totalProduction}
            totalSales={props.totalSales}
          />
        </div>
        <Menu
          name={props.name}
          onManualClick={this.onManualClick}
          onRankingClick={this.onRankingClick}
          onNameChange={props.onNameChange}
        />
        <div style={{ position: 'absolute', bottom: 25, right: 25 }}>
          © <a href="https://twitter.com/progremaster/">ぷろぐれ</a>
        </div>
        {
          // オーバーレイ
        }
        <PopupWindow onClick={this.onManualClick} style={{
          display: this.state.isShowingManual ? 'inherit' : 'none',
          position: 'absolute',
          left: 25,
          right: 25,
          top: 25,
          bottom: 25,
        }}>
          <Manual style={{ width: '100%' }} />
        </PopupWindow>
        <PopupWindow onClick={this.onRankingClick} style={{
          display: this.state.isShowingRanking ? 'inherit' : 'none',
          position: 'absolute',
          left: 25,
          right: 25,
          top: 25,
          bottom: 25,
        }}>
          <Ranking
            style={{ width: '100%' }}
            totalRanking={props.totalRanking}
            hourlyRanking={props.hourlyRanking}
          />
        </PopupWindow>
      </div >
    );
  }

  private onManualClick() {
    this.setState({ ...this.state, isShowingManual: !this.state.isShowingManual });
  }

  private onRankingClick() {
    this.setState({ ...this.state, isShowingRanking: !this.state.isShowingRanking });
  }
}

function GlobalStatus(props: {
  totalSales: number;
  totalProduction: number;
}) {
  return (
    <div style={{ marginLeft: 200, fontSize: 'x-large' }}>
      <State label="総生産数" count={props.totalProduction} unit="すたちゅー" /><br />
      <State label="総利益" count={props.totalSales} unit="すたちゅーコイン" />
    </div>
  );
}

function State(props: {
  label: string;
  count: number;
  unit: string;
}) {
  return (
    <span style={{ textAlign: 'right' }}>
      <span style={{ display: 'inline-block', width: 300 }}>{props.label}</span>
      <span style={{ display: 'inline-block', width: 300 }}>{props.count}</span>
      <small style={{ marginLeft: 10, fontSize: 'x-small' }}>{props.unit}</small>
    </span>
  );
}
