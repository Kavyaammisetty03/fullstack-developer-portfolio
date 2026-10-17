
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/portfolio')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        return response.json();
      })
      .then((data) => {
        setPortfolio(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load portfolio. Please check the backend.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="status-message">Loading portfolio...</p>;
  }

  if (error) {
    return <p className="status-message">{error}</p>;
  }

  return (
    <div>
      <nav className="navbar">
        <h2 className="logo">Kavya<span>.</span></h2>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section id="home" className="hero">
        <p className="greeting">HELLO, I'M</p>
        <h1>{portfolio.name}</h1>
        <h2>{portfolio.role}</h2>
        <p className="hero-description">{portfolio.message}</p>
        <a href="#projects" className="primary-btn">
          Explore My Projects
        </a>
      </section>

      <section id="about" className="section">
        <h2>About Me</h2>
        <p>
          I am a Computer Science graduate interested in building
          practical applications using Java, Spring Boot, React,
          and PostgreSQL.
        </p>
      </section>

      <section id="skills" className="section">
        <h2>Technical Skills</h2>
        <div className="skills-list">
          {portfolio.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section id="projects" className="section">
        <h2>My Projects</h2>
        <div className="projects-grid">
          <article className="project-card">
            <h3>CineFund</h3>
            <p>
              A Spring Boot backend featuring authentication,
              role-based access, and REST APIs.
            </p>
            <span>Java · Spring Boot · PostgreSQL</span>
          </article>

          <article className="project-card">
            <h3>RailPharma</h3>
            <p>
              A medicine delivery website designed to provide
              medicine-related services.
            </p>
            <span>Web Development</span>
          </article>

          <article className="project-card">
            <h3>AI Road Safety System</h3>
            <p>
              A road safety application that analyzes road images
              to identify potholes.
            </p>
            <span>AI · Web Development</span>
          </article>
        </div>
      </section>

      <section id="contact" className="section contact">
        <h2>Let's Connect</h2>
        <p>Interested in working together or discussing technology?</p>
        <a href="mailto:your-email@example.com" className="primary-btn">
          Contact Me
        </a>
      </section>

      <footer>
        <p>© 2026 Kavya Ammisetty. Built with React.</p>
      </footer>
    </div>
  );
}

export default App;
