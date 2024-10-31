import { Form } from "react-router-dom";


export default function Index() {
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
          <Form className="form-search" action="#" method="post">
            <input 
              id="search" 
              type="text" 
              name="search_field" 
            />
            <input 
              id="button-search" 
              type="image" 
              src="/images/n_01-loupe@2x.png" 
              alt="🔍"
            />
          </Form>
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