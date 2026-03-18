import { Link } from 'react-router-dom'
import { ShinyText } from '../components/reactbits/ShinyText'

export function ContactPage() {
  return (
    <main className="page">
      <header className="page-header">
        <div>
          <ShinyText>Get In Touch</ShinyText>
          <p className="subtext">We'd love to hear from you. Contact us for inquiries and feedback.</p>
        </div>
        <Link to="/" className="status-badge">
          Back to Feed
        </Link>
      </header>

      <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <article className="panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Contact Information</h2>
          
          <p style={{ fontSize: '1.1rem', color: '#b9aee8', marginBottom: '2rem' }}>
            Thank you for your interest in Veritas AI. We appreciate your feedback, questions, and partnership inquiries.
          </p>

          <div style={{
            background: 'rgba(143, 107, 255, 0.12)',
            border: '1px solid rgba(143, 107, 255, 0.35)',
            borderRadius: '0.8rem',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ marginTop: 0, color: '#fff' }}>Email</h3>
            <a href="mailto:souryapaul2007@gmail.com" style={{
              fontSize: '1.2rem',
              color: '#bfa6ff',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'color 0.3s ease'
            }} onMouseEnter={(e) => e.currentTarget.style.color = '#e5d9ff'}
               onMouseLeave={(e) => e.currentTarget.style.color = '#bfa6ff'}>
              souryapaul2007@gmail.com
            </a>
          </div>

          <div style={{
            background: 'rgba(92, 39, 255, 0.1)',
            border: '1px solid rgba(143, 107, 255, 0.32)',
            borderRadius: '0.8rem',
            padding: '2rem'
          }}>
            <h3 style={{ marginTop: 0, color: '#fff', marginBottom: '1rem' }}>How We Can Help</h3>
            <ul style={{
              textAlign: 'left',
              fontSize: '1rem',
              lineHeight: '1.8',
              color: '#d0d0d0',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              <li>Bug reports and feature requests</li>
              <li>Partnership and collaboration opportunities</li>
              <li>General inquiries and feedback</li>
              <li>Media and press inquiries</li>
              <li>API access and integration questions</li>
            </ul>
          </div>

          <p style={{ marginTop: '2rem', color: '#a8b7e8', fontSize: '0.95rem' }}>
            We typically respond to all inquiries within 24-48 hours.
          </p>
        </article>
      </div>
    </main>
  )
}
