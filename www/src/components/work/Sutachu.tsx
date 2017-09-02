import * as React from 'react';
import { FaceOfFigure } from '../../commons/domains/types';

export default function Sutachu(props: {
  style?: React.CSSProperties;
  face: FaceOfFigure;
}) {
  return (
    <div style={props.style}>
      {({
        udon: <Udon {...props.face} />,
        nature: <NatureSutahu {...props.face} />,
        '': <SutachuFigure {...props.face} />,
      })[props.face.special]}
    </div>
  );
}

function Udon(props: FaceOfFigure) {
  return (
    <div>
      <img style={{ position: 'absolute' }} src="/static/udon.png" />
      {({
        tail: (
          <img
            style={{ position: 'absolute' }}
            src="/static/rear-tail.png"
          />
        ),
        wrongtail: (
          <img
            style={{ position: 'absolute' }}
            src="/static/front-tail.png"
          />
        ),
      })[props.tail] || ''}
    </div>
  );
}

function NatureSutahu(props: FaceOfFigure) {
  if (props.prone) {
    return (
      <div>
        <img style={{ position: 'absolute' }} src="/static/rear-body.png" />
        <img style={{ position: 'absolute' }} src="/static/rear-tail.png" />
        {({
          tail: (
            <img
              style={{ position: 'absolute', left: 20 }}
              src="/static/rear-tail.png"
            />
          ),
          wrongtail: (
            <img
              style={{ position: 'absolute', left: -90 }}
              src="/static/front-tail.png"
            />
          ),
        })[props.tail] || ''}
      </div>
    );
  } else {
    return (
      <div>
        <img style={{ position: 'absolute' }} src="/static/front-body.png" />
        <img style={{ position: 'absolute' }} src="/static/front-tail.png" />
        {({
          tail: (
            <img
              style={{ position: 'absolute', top: -15 }}
              src="/static/front-tail.png"
            />
          ),
          wrongtail: (
            <img
              style={{ position: 'absolute', top: -15 }}
              src="/static/rear-tail.png"
            />
          ),
        })[props.tail] || ''}
      </div>
    );
  }
}

function SutachuFigure(props: FaceOfFigure) {
  if (props.prone) {
    return (
      <div>
        <img style={{ position: 'absolute' }} src="/static/rear-body.png" />
        {({
          tail: (
            <img
              style={{ position: 'absolute' }}
              src="/static/rear-tail.png"
            />
          ),
          wrongtail: (
            <img
              style={{ position: 'absolute', left: -90 }}
              src="/static/front-tail.png"
            />
          ),
        })[props.tail] || ''}
      </div>
    );
  } else {
    return (
      <div>
        <img style={{ position: 'absolute' }} src="/static/front-body.png" />
        {({
          tail: (
            <img
              style={{ position: 'absolute' }}
              src="/static/front-tail.png"
            />
          ),
          wrongtail: (
            <img
              style={{ position: 'absolute' }}
              src="/static/rear-tail.png"
            />
          ),
        })[props.tail] || ''}
      </div>
    );
  }
}
