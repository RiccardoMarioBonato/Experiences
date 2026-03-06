import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Section from './components/Section';
import Footer from './components/Footer';
import {
  aboutText,
  educationItems,
  experienceItems,
  projectItems,
  sectionConfig,
  skills
} from './data/resumeData';

function App() {
  const initialExpandedSections = sectionConfig.reduce((state, section) => {
    state[section.id] = section.defaultExpanded;
    return state;
  }, {});

  const sectionTitles = sectionConfig.reduce((titles, section) => {
    titles[section.id] = section.title;
    return titles;
  }, {});

  const [expandedSections, setExpandedSections] = useState(initialExpandedSections);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="app">
      <Navbar />
      <Header />

      <main className="main">
        <Section
          id="about"
          title={sectionTitles.about}
          isExpanded={expandedSections.about}
          onToggle={() => toggleSection('about')}
        >
          <p>{aboutText}</p>
        </Section>

        <Section
          id="experience"
          title={sectionTitles.experience}
          isExpanded={expandedSections.experience}
          onToggle={() => toggleSection('experience')}
        >
          {experienceItems.map((item) => (
            <div className="item" key={item.title}>
              <div className="item-header">
                <h3 className="item-title">{item.title}</h3>
                {item.date && <span className="date">{item.date}</span>}
              </div>
              {item.company && <p className="company">{item.company}</p>}
              {item.description && <p className="description">{item.description}</p>}
            </div>
          ))}
        </Section>

        <Section
          id="education"
          title={sectionTitles.education}
          isExpanded={expandedSections.education}
          onToggle={() => toggleSection('education')}
        >
          {educationItems.map((item) => (
            <div className="item" key={item.title}>
              <div className="item-header">
                <h3 className="item-title">{item.title}</h3>
                {item.date && <span className="date">{item.date}</span>}
              </div>
              {item.company && <p className="company">{item.company}</p>}
              {item.description && <p className="description">{item.description}</p>}
            </div>
          ))}
        </Section>

        <Section
          id="projects"
          title={sectionTitles.projects}
          isExpanded={expandedSections.projects}
          onToggle={() => toggleSection('projects')}
        >
          {projectItems.map((item) => (
            <div className="item" key={item.title}>
              <div className="item-header">
                <h3 className="item-title">{item.title}</h3>
                {item.date && <span className="date">{item.date}</span>}
              </div>
              {item.company && <p className="company">{item.company}</p>}
              {item.description && <p className="description">{item.description}</p>}
            </div>
          ))}
        </Section>

        <Section
          id="skills"
          title={sectionTitles.skills}
          isExpanded={expandedSections.skills}
          onToggle={() => toggleSection('skills')}
        >
          <div className="skills-grid">
            {skills.map((skill) => (
              <span className="skill" key={skill}>{skill}</span>
            ))}
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

export default App;