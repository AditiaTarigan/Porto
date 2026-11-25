import ContactForm from "@/app/components/contact-form";
import KeyboardWorld from "@/app/components/keyboard-world";
import ProjectsCarousel from "@/app/components/projects-carousel";
import SkillButtons from "@/app/components/skill-buttons";
import { profile, socials } from "@/app/data/portfolio";

const navigation = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Home() {
  return (
    <KeyboardWorld>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Back to Home"><span className="wordmark-mark">AD<span>.</span></span></a>
        <nav className="site-nav" aria-label="Main navigation">
          {navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <a className="header-note" href="#contact"><span className="status-dot" /> AVAILABLE FOR WORK <span aria-hidden="true">↗</span></a>
      </header>

      <main>
        <section className="hero section-shell" id="home" aria-labelledby="hero-title">
          <div className="hero-copy reveal-on-scroll">
            <p className="eyebrow"><span>01 / 04</span> DEVELOPER PORTFOLIO</p>
            <h1 id="hero-title"><span className="hero-intro-word">HELLO, I&apos;M</span><span className="hero-name">{profile.name}</span></h1>
            <p className="hero-role">{profile.role}</p>
            <p className="hero-description">{profile.intro}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">Explore projects <span aria-hidden="true">↘</span></a>
              <a className="text-link" href="#skills">Press a key <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div className="hero-scroll-cue"><span className="mouse-icon"><i /></span><span>SCROLL TO EXPLORE</span></div>
          <span className="hero-index" aria-hidden="true">01 — 04</span>
        </section>

        <section className="skills-section section-shell" id="skills" aria-labelledby="skills-title">
          <p className="eyebrow"><span>02 / 04</span> THE TOOLBOX</p>
          <div className="skills-heading-row reveal-on-scroll">
            <h2 id="skills-title">SKILLS<span className="heading-outline">.</span></h2>
            <p className="press-hint">( HINT: PRESS A KEY )</p>
          </div>
          <div className="skills-copy reveal-on-scroll"><span>25 KEYS · 25 WAYS TO MAKE IT WORK</span><p>Hover, tap, or use the key shown on each cap.</p></div>
          <SkillButtons />
        </section>

        <section className="project-section section-shell" id="projects" aria-labelledby="projects-title">
          <div className="section-topline reveal-on-scroll"><p className="eyebrow"><span>03 / 04</span> MADE WITH CURIOSITY</p><span className="section-code">SIDE QUESTS INCLUDED</span></div>
          <h2 id="projects-title">PROJECTS<span className="heading-outline">.</span></h2>
          <p className="projects-intro reveal-on-scroll">A few things from the workbench. Pick a card and take a look around.</p>
          <div className="reveal-on-scroll"><ProjectsCarousel /></div>
          <p className="cat-caption">I supervise the keyboard. The keyboard supervises the code.</p>
        </section>

        <section className="contact-section section-shell" id="contact" aria-labelledby="contact-title">
          <p className="eyebrow"><span>04 / 04</span> GOT A GOOD ONE?</p>
          <div className="contact-layout reveal-on-scroll">
            <div className="contact-copy">
              <h2 id="contact-title">LET&apos;S WORK<br /><span>TOGETHER</span><i>.</i></h2>
              <p>Have an idea, a challenge, or a keyboard shortcut I should know? My inbox is open.</p>
              <span className="contact-decoration" aria-hidden="true">✳</span>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <a className="footer-mark" href="#home" aria-label="Back to top">AD<span>.</span></a>
        <p>DESIGNED & BUILT WITH A LITTLE TOO MUCH COFFEE.</p>
        <nav className="social-links" aria-label="Social links">
          {socials.map((social) => social.url
            ? <a key={social.name} href={social.url} target="_blank" rel="noreferrer" aria-label={social.name}>{social.mark}</a>
            : <span key={social.name} aria-label={`${social.name} link not set`}>{social.mark}</span>)}
        </nav>
      </footer>
    </KeyboardWorld>
  );
}
