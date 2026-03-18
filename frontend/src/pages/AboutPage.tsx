import { Link } from 'react-router-dom'
import { ShinyText } from '../components/reactbits/ShinyText'

export function AboutPage() {
  return (
    <main className="page">
      <header className="page-header">
        <div>
          <ShinyText>About Veritas AI</ShinyText>
          <p className="subtext">Empowering news verification through artificial intelligence.</p>
        </div>
        <Link to="/" className="status-badge">
          Back to Feed
        </Link>
      </header>

      <article className="panel" style={{ maxWidth: '900px', margin: '2rem auto' }}>
        <h2 style={{ marginTop: 0 }}>Project Overview</h2>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
          Veritas AI is an intelligent news verification platform designed to combat misinformation and provide users with reliable, fact-checked news content. Our mission is to empower readers with the tools and information they need to make informed decisions in an age of rapidly spreading information.
        </p>

        <h2>Core Capabilities</h2>
        
        <h3>1. Real-Time News Aggregation</h3>
        <p>
          Our platform aggregates news from multiple trusted sources including BBC, The New York Times, and Al Jazeera, ensuring diverse perspectives and comprehensive coverage of global events. Articles are categorized by topic and continuously updated to keep you informed.
        </p>

        <h3>2. AI-Powered Verification</h3>
        <p>
          Using advanced natural language processing and machine learning models, Veritas AI analyzes article claims, sources, and factual accuracy. Our verification engine cross-references information across multiple sources to identify inconsistencies and validate key facts.
        </p>

        <h3>3. Intelligent Search</h3>
        <p>
          Our search functionality allows users to find relevant articles by topic, keyword, or source. The AI-powered search understands context and meaning, delivering the most relevant results for your queries.
        </p>

        <h3>4. Source Reliability Scoring</h3>
        <p>
          Each article includes a reliability score based on the source's historical accuracy, editorial standards, and fact-checking track record. This helps readers quickly assess the trustworthiness of information.
        </p>

        <h3>5. Comprehensive Article Reader</h3>
        <p>
          Our full-featured article reader provides complete article text, source attribution, publication date, and category information. Readers can engage with complete stories without distraction.
        </p>

        <h3>6. Evidence-Based Claims Analysis</h3>
        <p>
          When viewing articles, Veritas AI highlights key claims and provides evidence supporting or refuting them. Our color-coded confidence levels help readers understand the certainty of information.
        </p>

        <h2>Why Veritas AI?</h2>
        <ul style={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
          <li><strong>Trustworthy Sources:</strong> Aggregates from established news organizations with proven editorial standards.</li>
          <li><strong>Transparent Analysis:</strong> All verification reasoning is shown to users with clear explanations.</li>
          <li><strong>Fast Updates:</strong> Real-time feed ensures you're seeing the latest verified information.</li>
          <li><strong>Multiple Perspectives:</strong> Access diverse viewpoints from different reputable news outlets.</li>
          <li><strong>User-Friendly:</strong> Intuitive interface makes fact-checking accessible to everyone.</li>
        </ul>

        <h2>Our Vision</h2>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
          We believe that reliable information is fundamental to a healthy democracy. By combining human journalism with artificial intelligence, Veritas AI creates a platform where truth matters and misinformation is identified and exposed. Our goal is to be the trusted source for verified news that readers can rely on.
        </p>
      </article>
    </main>
  )
}
