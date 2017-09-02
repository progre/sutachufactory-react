import Sutachu from './Sutachu';

export default function Sample(props: { style?: React.CSSProperties; }) {
  return (
    <div style={{
      ...props.style,
      display: 'inline-block',
      margin: 10,
      padding: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      border: '4px solid gray',
      borderRadius: 10,
      textDecorationLine: 'none',
      color: 'black',
    }}>
      <span style={{ display: 'inline-block', height: '1em' }}>おてほん</span>
      <div style={{ width: 125, height: 125 }}>
        <Sutachu
          style={{ position: 'absolute', transform: 'scale(0.5)' }}
          face={{ prone: false, special: '', tail: 'tail' }}
        />
      </div>
    </div>
  );
}
