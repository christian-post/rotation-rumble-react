import { Link } from "react-router-dom";


export default function Header() {
  return (
    <header>
      <span className="header-logo">
        <Link to={"/"}>Rotation Rumble</Link>
      </span>
      <nav className="header-nav">
        <ul>
          <li className="header-item">
            <Link to={"advanced-search"}>Search</Link>
          </li>
          <li className="header-item">
            <Link to={"gallery"}>Card Gallery</Link>
          </li>
          <li className="header-item">
            <Link to={"deckbuilder"}>Deck Builder</Link>
          </li>
          <li className="header-item">
            <Link to={"test"}>Search</Link>
          </li>
        </ul>
      </nav>

      <a href="https://rotation-rumble.com/" id="back-to-website">
        <img src="/images/BacktoWebsite@2x.png" alt="" />
      </a>
      <img src="/images/Rotation_Rumble_Deckbuilder.png" alt="" id="rotation-rumble-logo"/>
    </header>
  )
}