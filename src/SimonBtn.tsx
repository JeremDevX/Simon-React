interface SimonBtnProps {
  color: string;
  onClick: () => void;
  id: string;
}

export default function SimonBtn(props: SimonBtnProps) {
  return (
    <button
      className={`game-btn ${props.color}`}
      id={props.id}
      onClick={props.onClick}
    ></button>
  );
}
