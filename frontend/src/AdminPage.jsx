import { useEffect, useRef, useState } from 'react';
import './AdminPage.css';

const API_URL = 'http://localhost:8080';

function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [credentials, setCredentials] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState('');
  const [skillMessage, setSkillMessage] = useState('');
  const [savingSkill, setSavingSkill] = useState(false);

  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('');
  const [editingSkillId, setEditingSkillId] = useState(null);

  const skillFormRef = useRef(null);
  const skillNameInputRef = useRef(null);

  async function loadSkills(authorization) {
    setSkillsLoading(true);
    setSkillsError('');

    try {
      const response = await fetch(`${API_URL}/api/skills/manage`, {
        headers: { Authorization: authorization },
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error('Admin authentication failed. Please sign in again.');
      }

      if (!response.ok) {
        throw new Error(`Unable to load skills (${response.status}).`);
      }

      const data = await response.json();

      if (
        !Array.isArray(data) ||
        data.some(
          (skill) =>
            typeof skill.id !== 'number' ||
            typeof skill.name !== 'string' ||
            typeof skill.category !== 'string'
        )
      ) {
        throw new Error('Unexpected response from the skills management API.');
      }

      setSkills(data);
    } catch (err) {
      setSkillsError(err.message || 'Unable to connect to the backend.');
    } finally {
      setSkillsLoading(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authorization = 'Basic ' + btoa(`${username}:${password}`);

      const response = await fetch(`${API_URL}/api/skills/manage`, {
        headers: { Authorization: authorization },
      });

      if (response.status === 401 || response.status === 403) {
        setError('Invalid admin username or password.');
        return;
      }

      if (!response.ok) {
        setError('Unable to verify admin access. Please try again.');
        return;
      }

      const data = await response.json();

      if (
        !Array.isArray(data) ||
        data.some(
          (skill) =>
            typeof skill.id !== 'number' ||
            typeof skill.name !== 'string' ||
            typeof skill.category !== 'string'
        )
      ) {
        setError('The skills management API returned unexpected data.');
        return;
      }

      setSkills(data);
      setCredentials({ username, authorization });
      setPassword('');
    } catch {
      setError(
        'Cannot connect to the backend. Please make sure Spring Boot is running.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (credentials) {
      loadSkills(credentials.authorization);
    }
  }, [credentials]);

  function resetSkillForm() {
    setSkillName('');
    setSkillCategory('');
    setEditingSkillId(null);
    setSkillMessage('');
    setSkillsError('');
  }

  async function handleSkillSubmit(event) {
    event.preventDefault();

    if (!credentials) return;

    const name = skillName.trim();
    const category = skillCategory.trim();

    if (!name || !category) {
      setSkillsError('Enter both the skill name and category.');
      return;
    }

    setSavingSkill(true);
    setSkillsError('');
    setSkillMessage('');

    const isEditing = editingSkillId !== null;
    const url = isEditing
      ? `${API_URL}/api/skills/${editingSkillId}`
      : `${API_URL}/api/skills`;

    try {
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          Authorization: credentials.authorization,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, category }),
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error('Admin authentication failed. Please sign in again.');
      }

      if (!response.ok) {
        let message = `Skill request failed (${response.status}).`;

        try {
          const responseData = await response.json();

          if (responseData.detail) {
            message = responseData.detail;
          } else if (responseData.message) {
            message = responseData.message;
          }
        } catch {
          // Keep the fallback error message.
        }

        throw new Error(
          response.status === 409 ? 'This skill already exists.' : message
        );
      }

      setSkillMessage(
        isEditing ? 'Skill updated successfully.' : 'Skill added successfully.'
      );

      setSkillName('');
      setSkillCategory('');
      setEditingSkillId(null);

      await loadSkills(credentials.authorization);
    } catch (err) {
      setSkillsError(err.message || 'Unable to save the skill.');
    } finally {
      setSavingSkill(false);
    }
  }

  function startEditingSkill(skill) {
    if (!skill || skill.id == null) {
      setSkillsError('Unable to select this skill for editing.');
      return;
    }

    setEditingSkillId(skill.id);
    setSkillName(skill.name);
    setSkillCategory(skill.category);
    setSkillMessage('');
    setSkillsError('');

    // Bring the form into view so the selected skill is visible.
    skillFormRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    // Focus the name field without causing another scroll.
    window.setTimeout(() => {
      skillNameInputRef.current?.focus({ preventScroll: true });
    }, 350);
  }

  async function handleDeleteSkill(skill) {
    if (!credentials) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${skill.name}"?`
    );

    if (!confirmed) return;

    setSkillsError('');
    setSkillMessage('');

    try {
      const response = await fetch(`${API_URL}/api/skills/${skill.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: credentials.authorization,
        },
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error('Admin authentication failed. Please sign in again.');
      }

      if (!response.ok) {
        throw new Error(`Unable to delete skill (${response.status}).`);
      }

      if (editingSkillId === skill.id) {
        setSkillName('');
        setSkillCategory('');
        setEditingSkillId(null);
      }

      setSkillMessage('Skill deleted successfully.');
      await loadSkills(credentials.authorization);
    } catch (err) {
      setSkillsError(err.message || 'Unable to delete the skill.');
    }
  }

  function handleLogout() {
    setCredentials(null);
    setUsername('');
    setPassword('');
    setSkills([]);
    setSkillName('');
    setSkillCategory('');
    setEditingSkillId(null);
    setError('');
    setSkillsError('');
    setSkillMessage('');
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <a className="admin-brand" href="/">
          Kavya<span>.</span>
        </a>

        <a className="admin-back-link" href="/">
          ← Back to Portfolio
        </a>
      </header>

      {!credentials ? (
        <section className="admin-login-card">
          <div className="admin-icon" aria-hidden="true">
            <span>⌘</span>
          </div>

          <p className="admin-eyebrow">PORTFOLIO MANAGEMENT</p>
          <h1>Admin Login</h1>

          <p className="admin-description">
            Sign in to access your portfolio management dashboard.
          </p>

          <form onSubmit={handleLogin}>
            <label htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              type="text"
              autoComplete="username"
              placeholder="Enter admin username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />

            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter admin password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {error && (
              <p className="admin-error" role="alert">
                {error}
              </p>
            )}

            <button className="admin-submit" type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>

          <p className="admin-security-note">
            Your credentials are kept in page memory and are not saved in local
            storage.
          </p>
        </section>
      ) : (
        <section className="admin-management">
          <div className="admin-dashboard-heading">
            <div>
              <p className="admin-eyebrow">PORTFOLIO ADMINISTRATION</p>
              <h1>Manage Your Portfolio</h1>
              <p className="admin-description">
                Add, update, and remove skills displayed on your portfolio.
              </p>
            </div>

            <button
              className="admin-logout-button"
              type="button"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>

          <section className="admin-management-card" ref={skillFormRef}>
            <p className="admin-eyebrow">TECHNICAL SKILLS</p>
            <h2>{editingSkillId !== null ? 'Edit Skill' : 'Add a Skill'}</h2>

            <form className="admin-skill-form" onSubmit={handleSkillSubmit}>
              <div className="admin-field">
                <label htmlFor="skill-name">Skill Name</label>
                <input
                  ref={skillNameInputRef}
                  id="skill-name"
                  type="text"
                  placeholder="Example: Java"
                  value={skillName}
                  onChange={(event) => setSkillName(event.target.value)}
                  maxLength={100}
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="skill-category">Category</label>
                <input
                  id="skill-category"
                  type="text"
                  placeholder="Example: Programming"
                  value={skillCategory}
                  onChange={(event) => setSkillCategory(event.target.value)}
                  maxLength={100}
                  required
                />
              </div>

              <div className="admin-form-actions">
                <button
                  className="admin-submit admin-form-submit"
                  type="submit"
                  disabled={savingSkill}
                >
                  {savingSkill
                    ? 'Saving...'
                    : editingSkillId !== null
                      ? 'Update Skill'
                      : 'Add Skill'}
                </button>

                {editingSkillId !== null && (
                  <button
                    className="admin-cancel-button"
                    type="button"
                    onClick={resetSkillForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {skillMessage && (
              <p className="admin-success" role="status">
                {skillMessage}
              </p>
            )}

            {skillsError && (
              <p className="admin-error" role="alert">
                {skillsError}
              </p>
            )}
          </section>

          <section className="admin-management-card">
            <div className="admin-list-heading">
              <div>
                <p className="admin-eyebrow">DATABASE RECORDS</p>
                <h2>Existing Skills</h2>
              </div>

              <button
                className="admin-refresh-button"
                type="button"
                onClick={() => loadSkills(credentials.authorization)}
                disabled={skillsLoading}
              >
                {skillsLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {skillsLoading && skills.length === 0 && (
              <p className="admin-description">Loading skills...</p>
            )}

            {!skillsLoading && skills.length === 0 && !skillsError && (
              <p className="admin-description">
                No skills are stored in the database yet.
              </p>
            )}

            {skills.length > 0 && (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Skill</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {skills.map((skill) => (
                      <tr key={skill.id}>
                        <td>{skill.id}</td>
                        <td>{skill.name}</td>
                        <td>{skill.category}</td>
                        <td>
                          <div className="admin-row-actions">
                            <button
                              className="admin-edit-button"
                              type="button"
                              onClick={() => startEditingSkill(skill)}
                            >
                              Edit
                            </button>

                            <button
                              className="admin-delete-button"
                              type="button"
                              onClick={() => handleDeleteSkill(skill)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="admin-management-card admin-coming-soon">
            <p className="admin-eyebrow">NEXT STEP</p>
            <h2>Projects Management</h2>
            <p className="admin-description">
              After testing skills management, we'll add forms to create, edit,
              and delete projects.
            </p>
          </section>
        </section>
      )}

      <footer className="admin-footer">
        © 2026 Kavya Ammisetty · Portfolio Admin
      </footer>
    </main>
  );
}

export default AdminPage;