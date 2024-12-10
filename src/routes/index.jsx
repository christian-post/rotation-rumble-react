import { Form } from "react-router-dom";
import { escapeRegex } from "../server/utils";


export default function Index() {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData)

    const response = await fetch("/api/simple-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Failed to fetch search results");
      return;
    }

    const resultData = await response.json();
    console.log("search result", resultData)
  };

  return (
    <main>
      <div className="grid-container landing-page-grid">
        <div className="grid-item" id="landing-search-call">
          <h1>Search for a<br/>Card Name</h1>
        </div>

        <div className="grid-item span-3-v" id="hero-image">
          <img 
            src="/images/BaseBlue_2_-_Ol_Fyndor300.png" 
            alt="Dieser Zaubertyp"
          />
        </div>

        <div className="grid-item" id="landing-searchbar">
          <form className="form-search" onSubmit={handleSubmit}>
            <input 
              id="search" 
              type="text" 
              name="name" 
            />
            <input 
              id="button-search" 
              type="image" 
              src="/images/n_01-loupe@2x.png" 
              alt="🔍"
            />
          </form>
        </div>

        <div className="grid-item" id="landing-paragraph">
          <p className="info-paragraph">
            Rotation Rumble is a card game in which you take on the role of a guild coach and hire mercenaries. You command them in weekly Rumble battles for money, cheesecake and glory. Choose wisely which fighters, challenges and items you combine to form the best possible squad of ruthless rumblers!
          </p>
        </div>
      </div>
    </main>
  );
}