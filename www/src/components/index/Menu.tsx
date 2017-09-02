// tslint:disable-next-line:import-name
import Link from 'next/link';

export default function Menu(props: {
  name: string;
  onManualClick(): void;
  onRankingClick(): void;
  onNameChange(e: React.FocusEvent<HTMLInputElement>): void;
}) {
  return (
    <div style={{
      position: 'absolute',
      width: '100%',
      padding: 0,
      top: 350,
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'sans-serif',
    }}>
      <style jsx>{`
        div {
          display: flex;
          flex-direction: row;
          margin-bottom: 20px;
        }

        div:first-child a {
          width: 350px;
        }
    `}</style>
      <div>
        <div>
          <a
            className="common-button"
            style={{ cursor: 'pointer' }}
            onClick={props.onManualClick}
          >
            作業説明
          </a>
        </div>
        <div>
          <a
            className="common-button"
            style={{ cursor: 'pointer' }}
            onClick={props.onRankingClick}
          >
            ランキング
          </a>
        </div>
      </div>
      <div>
        <input
          type="text"
          placeholder="従業者名..."
          value={props.name}
          className="common-button"
          style={{ width: 500, height: 118, borderRadius: 0 }}
          onChangeCapture={props.onNameChange}
        />
        <div>
          <Link href="/work">
            <a
              className="common-button"
              style={{ width: 200, borderColor: 'green' }}
            >
              出勤
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
