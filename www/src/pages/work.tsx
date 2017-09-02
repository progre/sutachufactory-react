try { require('source-map-support').install(); } catch (e) {/* NOP */ }
import * as React from 'react';
import WorkApplication from '../applications/WorkApplication';
import { FaceOfFigure } from '../commons/domains/types';
import Root from '../components/work/Root';

const initialState = {
  waitingFace: null as FaceOfFigure | null,
  currentFace: null as FaceOfFigure | null,
  finishedFace: null as FaceOfFigure | null,
  fadeOutFace: null as FaceOfFigure | null,
  productionVolume: 0,
  salary: 0,
  in: false,
};

export default class Work extends React.Component<{}, typeof initialState> {
  private app = new WorkApplication();

  constructor() {
    super();

    this.onKeyDown = this.onKeyDown.bind(this);
    this.state = initialState;
  }

  componentDidMount() {
    this.app.conveyorMoved.subscribe(() => {
      const faces = this.app.conveyor.getFaceOfFigures();
      this.setState({
        ...this.state,
        ...faces,
        productionVolume: this.app.productionVolume,
        salary: this.app.salary,
        in: true,
      });
      setTimeout(
        () => {
          this.setState({
            ...this.state,
            in: false,
          });
        },
        this.app.conveyorMovingMiliseconds,
      );
    });
    this.app.currentFaceOfFiguresChanged.subscribe(() => {
      const faces = this.app.conveyor.getFaceOfFigures();
      this.setState({
        ...this.state,
        ...faces,
        productionVolume: this.app.productionVolume,
        salary: this.app.salary,
      });
    });
    document.addEventListener('keydown', this.onKeyDown);
    this.app.start();
  }

  componentWillUnmount() {
    this.app.end();
    document.removeEventListener('keydown', this.onKeyDown);
  }

  private onKeyDown(e: KeyboardEvent) {
    switch (e.code) {
      case 'Enter':
      case 'KeyZ':
      case 'KeyX':
        this.app.pushKey(e.code);
        return;
      default:
        return; // NOP
    }
  }

  render() {
    return (
      <Root
        waitingFace={this.state.waitingFace}
        currentFace={this.state.currentFace}
        finishedFace={this.state.finishedFace}
        fadeOutFace={this.state.fadeOutFace}
        productionVolume={this.state.productionVolume}
        salary={this.state.salary}
        animationMiliseconds={this.app.conveyorMovingMiliseconds}
        in={this.state.in}
      />
    );
  }
}
