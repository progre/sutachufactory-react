import * as React from 'react';
import * as CSSTransition from 'react-transition-group/CSSTransition';
import { FaceOfFigure } from '../../commons/domains/types';
import Sutachu from './Sutachu';

const SUTA_SIZE = 250;
const DISTANCE = 415;

export default function ProductionLine(props: {
  style?: React.CSSProperties;
  waitingFace: FaceOfFigure | null;
  currentFace: FaceOfFigure | null;
  finishedFace: FaceOfFigure | null;
  fadeOutFace: FaceOfFigure | null;
  animationMiliseconds: number;
  in: boolean;
}) {
  return (
    <div style={props.style}>
      <div style={{ position: 'absolute', left: -DISTANCE + 100 }}>
        <CSSTransition
          classNames="figure"
          in={props.in}
          timeout={props.animationMiliseconds}
        >
          {
            !props.fadeOutFace ? <div /> :
              <Sutachu face={props.fadeOutFace} />
          }
        </CSSTransition>
      </div>
      <div style={{ position: 'absolute', left: 100 }}>
        <CSSTransition
          classNames="figure"
          in={props.in}
          timeout={props.animationMiliseconds}
        >
          {
            !props.finishedFace ? <div /> :
              <Sutachu face={props.finishedFace} />
          }
        </CSSTransition>
      </div>
      <div style={{ position: 'absolute', left: 1280 / 2 - SUTA_SIZE / 2 }}>
        <CSSTransition
          classNames="figure"
          in={props.in}
          timeout={props.animationMiliseconds}
        >
          {
            !props.currentFace ? <div /> :
              <Sutachu face={props.currentFace} />
          }
        </CSSTransition>
      </div>
      <div style={{ position: 'absolute', right: 100 + SUTA_SIZE }}>
        <CSSTransition
          classNames="figure"
          in={props.in}
          timeout={props.animationMiliseconds}
        >
          {
            !props.waitingFace ? <div /> :
              <Sutachu face={props.waitingFace} />
          }
        </CSSTransition>
      </div>
    </div>
  );
}
