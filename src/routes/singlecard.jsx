import { useLocation } from "react-router-dom";


export default function SingleCard() {
  const location = useLocation();
  const { card } = location.state || { card: null };

  // TODO: get card id from URL

  return (
    <main>
      <div className="grid-container" style={{ gridTemplateColumns: "100%" }}>
        <div className="grid-item">

        </div>
      </div>
    </main>
  );
}
