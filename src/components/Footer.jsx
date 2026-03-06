import { siteConfig } from '../data/resumeData';

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {siteConfig.footerYear} {siteConfig.footerName}. All rights reserved.</p>
    </footer>
  );
}
