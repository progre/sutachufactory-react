// tslint:disable-next-line:import-name
import Link from 'next/link';
import * as React from 'react';
import { FaceOfFigure } from '../../commons/domains/types';
import Header from '../Header';
import InGameHelp from './InGameHelp';
import ProductionLine from './ProductionLine';
import Sample from './Sample';

export default function Root(props: {
  waitingFace: FaceOfFigure | null;
  currentFace: FaceOfFigure | null;
  finishedFace: FaceOfFigure | null;
  fadeOutFace: FaceOfFigure | null;
  productionVolume: number;
  salary: number;
  animationMiliseconds: number;
  in: boolean;
}) {
  return (
    <div>
      <Header />
      <Link href="/">
        <a
          className="common-button"
          style={{ position: 'absolute', width: 200 }}
        >
          退勤
        </a>
      </Link>
      <Sample style={{ position: 'absolute', left: 545 }} />
      <ProductionLine
        {...props}
        style={{
          width: 1280,
          height: 300,
          position: 'absolute',
          top: 235,
          overflow: 'hidden',
        }}
      />
      <InGameHelp
        style={{
          position: 'absolute',
          bottom: 0,
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: 32,
        right: 32,
        textAlign: 'right',
        fontSize: 'xx-large',
      }}>
        {props.productionVolume}
        <Unit>すたちゅー</Unit><br />
        <span style={{ color: props.salary < 0 ? 'red' : 'initial' }}>
          {props.salary}
        </span>
        <Unit>すたちゅーコイン</Unit>
      </div>
    </div>
  );
}

function Unit(props: { children?: React.ReactNode }) {
  return (
    <small style={{
      textAlign: 'left',
      fontSize: 'x-small',
      marginLeft: '1em',
      display: 'inline-block',
      width: '100px',
    }}>
      {props.children}
    </small >
  );
}
