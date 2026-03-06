import { siteConfig } from '../data/resumeData';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="#about" className="brand">{siteConfig.brand}</a>
        <div className="nav-links">
          {siteConfig.navLinks.map((link) => (
            <a key={link.id} href={`#${link.id}`} className="nav-link">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
