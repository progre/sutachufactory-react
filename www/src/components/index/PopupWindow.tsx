export default function PopupWindow(props: {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick(): void;
}) {
  return (
    <div
      className="common-border"
      style={{ backgroundColor: 'white', ...props.style }}
    >
      {props.children}
      <a
        style={{
          position: 'absolute',
          left: 20,
          fontSize: 60,
          cursor: 'pointer',
        }}
        onClick={props.onClick}
      >
        ×
      </a>
    </div>
  );
}
