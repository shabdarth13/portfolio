import Image from "next/image";
import { Lab } from "@/components/Lab";
import { Nav } from "@/components/Nav";
import { Palette } from "@/components/Palette";
import { Showcase } from "@/components/Showcase";
import { credentials, experience, profile, skills } from "@/data/content";

export default function Home() {
  return (
    <>
      <Nav />
      <Palette />
      <main id="top">
        <section className="hero">
          <div className="inner hero-grid">
            <div>
              <h1>Shabdarth</h1>
              <p className="lede">
                I learn systems by building them. A Redis-compatible database, a compiler, a phishing
                classifier: all written from the ground up.
              </p>
              <p className="avail">Final-year B.Tech CSE, class of 2027. Open to SDE and backend roles.</p>
            </div>
            <Lab />
          </div>
        </section>

        <section className="inner intro">
          <Image src="/shabdarth.jpg" alt="Portrait of Shabdarth" width={400} height={400} priority />
          <div>
            <p className="pull">Two security internships, one in vulnerability assessment and one in digital forensics with Uttar Pradesh Police.</p>
            <p>
              I study Computer Science at Graphic Era Hill University in Dehradun. Outside coursework I have
              built eight-plus projects across systems programming, compilers, machine learning and
              full-stack web, most with tests and live deployments.
            </p>
            <p className="inline-links">
              <a href={profile.github}>GitHub</a>
              <a href={profile.linkedin}>LinkedIn</a>
            </p>
          </div>
        </section>

        <section id="projects" className="inner block">
          <h2>Projects</h2>
          <Showcase />
        </section>

        <section id="experience" className="inner block">
          <h2>Experience</h2>
          <div className="jobs">
            {experience.map((j) => (
              <article key={j.role} className="job">
                <p className="when">{j.when}</p>
                <div>
                  <h3>{j.role}</h3>
                  <p className="org">{j.org}</p>
                  <p>{j.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="inner block">
          <h2>Skills</h2>
          <div className="skills">
            {skills.map((g) => (
              <div key={g.label}>
                <h3>{g.label}</h3>
                <ul>{g.items.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            ))}
          </div>
          <h3 className="cred-head">Education and credentials</h3>
          <p className="edu">B.Tech, Computer Science and Engineering. Graphic Era Hill University, 2023 to 2027.</p>
          <ul className="creds">{credentials.map((c) => <li key={c}>{c}</li>)}</ul>
        </section>

        <section id="contact" className="contact">
          <div className="inner">
            <h2>Let&rsquo;s talk</h2>
            <a className="big" href={`mailto:${profile.email}`}>{profile.email}</a>
            <a className="big" href={`tel:${profile.phoneHref}`}>{profile.phone}</a>
            <p>{profile.location}</p>
          </div>
        </section>
      </main>
    </>
  );
}
