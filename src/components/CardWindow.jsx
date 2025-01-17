import CardImage from "./CardImage";
import { CardInfo } from "../routes/singlecard";

export default function CardWindow({ props }) {
  return (
    <div className="card-window">
      <div id="singlecard-image">
        <CardImage props={{ card: props.card, sizing: "large" }} />
      </div>
      <CardInfo props={{card: props.card }} />
    </div>
  );
}