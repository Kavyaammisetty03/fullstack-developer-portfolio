
import { useEffect, useState } from 'react';
import './App.css';

const aiInterests = [
  {
    number: '01',
    title: 'AI Application Development',
    description:
      'Interested in building practical AI-powered applications that solve real-world problems and improve user experiences.',
    tags: ['AI Apps', 'Problem Solving'],
  },
  {
    number: '02',
    title: 'Learning Artificial Intelligence',
    description:
      'Exploring AI concepts, generative AI, and ways to integrate intelligent features into web applications.',
    tags: ['AI Fundamentals', 'Generative AI'],
  },
  {
    number: '03',
    title: 'Prompt Engineering',
    description:
      'Learning to write effective prompts, guide AI tools, and use AI responsibly for coding, research, and productivity.',
    tags: ['Prompt Design', 'AI Tools'],
  },
];

const certificates = [
  {
    title: 'Java Certificate',
    file: '/certificates/java-certificate.pdf',
    downloadName: 'java-certificate.pdf',
  },
  {
    title: 'SQL Certificate',
    file: '/certificates/sql-certificate.pdf',
    downloadName: 'sql-certificate.pdf',
  },
];

const additionalSkills = [
  'Java 8',
  'SQL',
  'REST API',
  'Microservices',
  'SpringBoot JPA',
  'SpringBoot Security',
  'Swagger UI',
  'PostMan',
  'AI Fundamentals',
  'Git',
  'Maven',
];

function App() {
  const [portfolio, setPortfolio] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [skillsError, setSkillsError] = useState('');

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
      })
      .catch(() => {
        setError('Unable to load portfolio. Please check the backend.');
      })
      .finally(() => {
        setLoading(false);
      });

    fetch('http://localhost:8080/api/skills')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch skills');
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error('Invalid skills response');
        }
        setSkills(data);
      })
      .catch(() => {
        setSkillsError('Unable to load skills from the database.');
      });
  }, []);

  const displayedSkills = [
    ...new Map(
      [...skills, ...additionalSkills].map((skill) => [
        skill.trim().toLowerCase(),
        skill.trim(),
      ])
    ).values(),
  ];

  if (loading) {
    return <p className="status-message">Loading portfolio...</p>;
  }

  if (error || !portfolio) {
    return (
      <p className="status-message">
        {error || 'Portfolio data is unavailable.'}
      </p>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <a href="#home" className="logo">
          Kavya<span>.</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#ai-interests">AI</a>
          <a href="#certifications">Certifications</a>
          <a href="#contact">Contact</a>
        </div>

        <a
          href="/kavya-resume.pdf"
          className="resume-btn"
          download="kavya-resume.pdf"
        >
          Download Resume
        </a>
      </nav>

      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <p className="greeting">HELLO, I'M</p>

            <h1>{portfolio.name}</h1>
            <h2>{portfolio.role}</h2>

            <p className="hero-description">
              {portfolio.careerObjective || portfolio.message}
            </p>

            <p className="hero-note">
              Building with Java. Exploring AI. Creating meaningful
              digital experiences.
            </p>

            <div className="hero-buttons">
              <a href="#projects" className="primary-btn">
                Explore My Projects <span>→</span>
              </a>

              <a href="#contact" className="secondary-btn">
                Contact Me
              </a>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <div className="image-decoration"></div>

            <img
              src="/images/kavya-profile.jpeg"
              alt="Kavya Ammisetty"
              className="profile-image"
            />

            <div className="image-caption">
              <span className="status-dot"></span>
              <span>Java Full Stack Developer</span>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <p className="section-label">GET TO KNOW ME</p>
          <h2>About Me</h2>

          <p className="section-description">
            I am a Computer Science graduate and Java Full Stack
            Developer interested in building practical applications
            using Java, Spring Boot, React, and PostgreSQL.
            Familiar with developing backend services using Spring Boot,
            JPA, Hibernate, implementing application security using
            Spring Security and JWT authentication, and understanding
            Microservices architecture and system integration.
            Knowledgeable in API design, backend application
            development, and the use of Generative AI tools and
            prompt engineering to support coding, debugging, and
            solution design.
            I enjoy learning new technologies and exploring how artificial
            intelligence can make software more useful and intelligent.
          </p>
        </section>

        <section id="skills" className="section">
          <p className="section-label">WHAT I WORK WITH</p>
          <h2>Technical Skills</h2>

          {skillsError && (
            <p className="status-message">{skillsError}</p>
          )}

          <div className="skills-list">
            {displayedSkills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </section>

        <section id="projects" className="section">
          <p className="section-label">MY WORK</p>
          <h2>Featured Projects</h2>

          <div className="projects-grid">
            <article className="project-card">
              <span className="project-number">01</span>
              <h3>Library Management Application</h3>
              <p>
                Developed a Library Management Application using Java,
                Spring Boot, and PostgreSQL to manage library operations
                efficiently. Implemented user authentication and
                role-based access control to ensure secure access to
                application features. Developed REST APIs for book search,
                book upload, availability checking, purchasing, and
                returning books. Used Spring Data JPA and Hibernate for
                database operations and followed a layered architecture
                consisting of Entity, Repository, Service, and Controller
                layers. Utilized Maven for dependency management and Git
                for version control to maintain clean, modular, and
                maintainable code.
              </p>

              <div className="project-tags">
                <span>Java</span>
                <span>Spring Boot</span>
                <span>PostgreSQL</span>
              </div>
            </article>

            <article className="project-card">
              <span className="project-number">02</span>
              <h3>RailPharma</h3>
              <p>
                RailPharma is a Medicine Delivery Website developed to
                simplify the process of searching for and ordering
                medicines online. The application allows users to browse
                available medicines, view product details, and place
                medicine orders conveniently. Developed using web
                technologies, the project focuses on providing a
                user-friendly interface and an efficient medicine ordering
                experience. It aims to improve accessibility to medicines
                by making the process of finding and ordering pharmaceutical
                products easier and more convenient.
              </p>

              <div className="project-tags">
                <span>HTML</span>
                <span>CSS</span>
                <span>JavaScript</span>
                <span>SQL</span>
                <span>React.js</span>
              </div>
            </article>

            <article className="project-card">
              <span className="project-number">03</span>
              <h3>AI Road Safety System</h3>
              <p>
                Developed an AI-Driven Road Safety System to improve road
                safety by identifying potholes and analyzing road
                conditions using artificial intelligence. The application
                allows users to upload road images for pothole detection
                and highlights detected potholes in red to make damaged
                areas easily identifiable. It also includes user
                registration and login, a dashboard displaying vehicle
                and road-related information, and a route analysis feature
                to help users assess road conditions. The project aims to
                support safer travel by enabling better road condition
                monitoring and helping identify potentially hazardous
                road areas.
              </p>

              <div className="project-tags">
                <span>AI</span>
                <span>Python</span>
                <span>Web Development</span>
              </div>
            </article>

            <article className="project-card">
              <span className="project-number">04</span>
              <h3>Fitness Tracker</h3>
              <p>
                Developed a Fitness Tracker Application using HTML, CSS,
                and JavaScript to promote healthy lifestyles among
                children, adults, and women. The application provides
                basic fitness guidance, including yoga poses, exercises,
                and wellness activities suitable for different age groups.
                Designed a simple, user-friendly interface to help users
                explore fitness routines and encourage regular physical
                activity. The project focuses on creating awareness about
                fitness, flexibility, and maintaining a healthy lifestyle
                through accessible and easy-to-follow activities.
              </p>

              <div className="project-tags">
                <span>HTML</span>
                <span>CSS</span>
                <span>JavaScript</span>
              </div>
            </article>
          </div>
        </section>

        <section id="ai-interests" className="section">
          <p className="section-label">MY NEXT LEARNING JOURNEY</p>
          <h2>AI &amp; Learning Interests</h2>

          <p className="section-description ai-intro">
            Alongside full-stack development, I am exploring artificial
            intelligence and how to build useful AI-powered applications.
            I am excited to keep learning, experimenting, and turning
            ideas into projects.
          </p>

          <div className="projects-grid ai-grid">
            {aiInterests.map((interest) => (
              <article
                className="project-card ai-card"
                key={interest.number}
              >
                <span className="project-number">{interest.number}</span>

                <h3>{interest.title}</h3>
                <p>{interest.description}</p>

                <div className="project-tags">
                  {interest.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="certifications" className="section">
          <p className="section-label">MY ACHIEVEMENTS</p>
          <h2>Certifications</h2>

          <div className="certificates-grid">
            {certificates.map((certificate) => (
              <article
                className="certificate-card"
                key={certificate.title}
              >
                <h3>{certificate.title}</h3>

                <iframe
                  src={`${certificate.file}#toolbar=0&navpanes=0`}
                  title={`${certificate.title} PDF Preview`}
                  className="certificate-preview"
                />

                <div className="certificate-actions">
                  <a
                    href={certificate.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="primary-btn"
                  >
                    View Certificate
                  </a>

                  <a
                    href={certificate.file}
                    download={certificate.downloadName}
                    className="secondary-btn"
                  >
                    Download PDF
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact">
          <p className="section-label">LET'S CONNECT</p>
          <h2>Have an idea to build?</h2>

          <p className="section-description">
            I would love to connect, exchange ideas, and explore
            opportunities in full-stack development and AI applications.
          </p>

          <a
            href="mailto:21jr1a0503@gmail.com"
            className="primary-btn"
          >
            Get in Touch <span>→</span>
          </a>
        </section>
      </main>

      <footer>
        <p>© 2026 Kavya Ammisetty. Built with React.</p>
      </footer>
    </div>
  );
}

export default App;
