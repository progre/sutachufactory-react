export default function InGameHelp(props: { style?: React.CSSProperties; }) {
  return (
    <div style={props.style}>
      <ul style={{
        fontSize: 'xx-large',
      }}>
        <style jsx>{`
        li {
          list-style: none;
        }

        li span {
          display: inline-block;
          width: 1em;
        }
    `}</style>
        <li><span>🅉</span> しっぽを付ける</li>
        <li><span>🅇</span> うらがえす</li>
        <li><span>⮐</span> 送る</li>
      </ul>
    </div>
  );
}
