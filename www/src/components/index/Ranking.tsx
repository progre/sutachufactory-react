import { Ranking } from '../../commons/domains/apis';

export default function Ranking(props: {
  style?: React.CSSProperties;
  totalRanking: Ranking;
  hourlyRanking: Ranking;
}) {
  return (
    <div style={props.style}>
      <h1 style={{ textAlign: 'center' }}>
        ランキング
      </h1>
      <div style={{ display: 'flex' }}>
        <OneRanking title="累計" ranking={props.totalRanking} style={{ width: '50%' }} />
        <OneRanking title="1時間ごと" ranking={props.hourlyRanking} style={{ width: '50%' }} />
      </div>
    </div>
  );
}

function OneRanking(props: {
  style?: React.CSSProperties;
  title: string;
  ranking: Ranking;
}) {
  return (
    <section style={props.style}>
      <h1 style={{ textAlign: 'center' }}>{props.title}</h1>
      <ul style={{
        listStyle: 'none',
      }}>
        {props.ranking.map((x, i) => (
          <li key={i}>
            <div style={{
              display: 'flex',
              direction: 'horizontal',
            }}>
              <div>{1 + i}.</div>
              <div style={{
                marginLeft: '2em',
                flexGrow: 1,
                whiteSpace: 'nowrap',
                width: 'auto',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {x.name}
              </div>
              <div style={{
                width: 150,
                textAlign: 'right',
                marginRight: '2em',
              }}>
                {x.productionVolume} <small style={{ fontSize: 'x-small' }}>
                  すたちゅー
                </small>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
