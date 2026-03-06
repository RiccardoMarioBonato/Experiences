import { profile } from '../data/resumeData';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="name">{profile.fullName}</h1>
        <p className="title">{profile.role}</p>
        <div className="contact">
          {profile.contacts.map((contact) => (
            <span key={contact}>{contact}</span>
          ))}
        </div>
      </div>
    </header>
  );
}
