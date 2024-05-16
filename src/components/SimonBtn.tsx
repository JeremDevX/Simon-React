interface SimonBtnProps {
  color: string;
  onClick: () => void;
  id: string;
  sequence: boolean;
  style: React.CSSProperties;
}

export default function SimonBtn(props: SimonBtnProps) {
  const highlight = props.sequence ? "highlight" : "";
  return (
    <button
      className={`game-btn ${props.color} ${highlight}`}
      id={props.id}
      onClick={props.onClick}
      style={props.style}
    ></button>
  );
}
