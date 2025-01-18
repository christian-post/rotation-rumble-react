import { Link } from "react-router-dom";

const isDevelopment = import.meta.env.MODE === "development"; // For Vite

export default function Header() {
  return (
    <header>
      <nav className="header-nav">
        <ul>
          <li className="header-item">
            <Link to={"/"}>Rotation Rumble</Link>
          </li>
          <li className="header-item">
            <Link to={"advanced-search"}>Search</Link>
          </li>
          <li className="header-item">
            <Link to={"card-gallery"}>Card Gallery</Link>
          </li>
          <li className="header-item">
            <Link to={"deckbuilder"}>Deck Builder</Link>
          </li>
          {isDevelopment && <li className="header-item">
            <Link to={"test"}>Test</Link>
          </li>}
        </ul>
      </nav>

      <a href="https://beaverlicious.com/" id="back-to-website">
        <img src="/images/BacktoWebsite@2x.png" alt="" />
      </a>
      <img src="/images/Rotation_Rumble_Deckbuilder.png" alt="" id="rotation-rumble-logo"/>
    </header>
  )
}