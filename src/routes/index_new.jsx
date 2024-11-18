import { Form } from "react-router-dom";

export default function Index() {
  return (
    <main>
      <div className="grid-container landing-page-grid">

        <div className="grid-item" id="landing-searchbar">
          <Form className="form-search" action="#" method="post">
            <input 
              id="search" 
              type="text" 
              name="search_field"
              placeholder="Search for cards or decks"
            />
            <input 
              id="button-search" 
              type="image" 
              src="/images/n_01-loupe@2x.png" 
              alt="🔍"
            />
          </Form>
        </div>
      </div>
    </main>
  );
}