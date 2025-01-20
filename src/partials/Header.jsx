import { useState } from "react";
import { Link } from "react-router-dom"

const isDevelopment = import.meta.env.MODE === "development"; // For Vite

export default function Header() {

  const [navExpanded, setNavExpanded] = useState(false);


  function NavToggle() {
    return (
      <button
        className="nav-toggle"
        onClick={()=> setNavExpanded(!navExpanded)}
      >
        <i className={`fa fa-${navExpanded ? "close" : "bars"}`} />
        <span className="sr-only">Menu</span>
      </button>
    );
  }


  return (
    <header>
      <nav className="header-nav">
        <NavToggle />
        <ul className={`ul-${navExpanded ? "expanded" : "collapsed"}`}>
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