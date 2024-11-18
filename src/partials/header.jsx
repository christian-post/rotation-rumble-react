export default function Header() {
  return (
    <header>
      <span className="header-logo"><a href="/">Rotation Rumble</a></span>
      <nav className="header-nav">
        <ul>
          <li className="header-item">
            <a href="/advanced-search/">Search</a>
          </li>
          <li className="header-item">
            <a href="#">Card Gallery</a>
          </li>
          <li className="header-item">
            <a href="#">Deck Builder</a>
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