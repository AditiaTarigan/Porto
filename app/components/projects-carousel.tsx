"use client";

import { useState } from "react";
import { projects } from "@/app/data/portfolio";
import BongoCat from "@/app/components/bongo-cat";

function ProjectLink({ href, children, tabIndex }: { href: string; children: string; tabIndex: number }) {
  return href ? (
    <a className="project-link" href={href} target="_blank" rel="noreferrer" tabIndex={tabIndex}>{children}<span aria-hidden="true">↗</span></a>
  ) : (
    <span className="project-link is-unavailable" aria-label={`${children}, tautan belum diisi`}>{children}<span aria-hidden="true">↗</span></span>
  );
}

export default function ProjectsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const move = (amount: number) => setActiveIndex((index) => (index + amount + projects.length) % projects.length);

  return (
    <div className="projects-showcase">
      <div className="project-cat-stage"><BongoCat /><span>typing buddy.exe</span></div>
      <div className="project-carousel" aria-label="Carousel proyek">
        <div className="project-track">
          {projects.map((project, index) => {
            const offset = ((index - activeIndex + projects.length + 1) % projects.length) - 1;
            const visible = Math.abs(offset) <= 1;
            return (
              <article
                className={`project-slide project-slide-${project.tone}${index === activeIndex ? " is-active" : ""}`}
                key={project.id}
                style={{ transform: `translate(-50%, 0) translateX(${offset * 108}%) scale(${index === activeIndex ? 1 : 0.88})` }}
                aria-hidden={!visible}
              >
                <div className="project-thumb" aria-hidden="true">
                  <div className="thumb-window">
                    <div className="thumb-bar"><i /><i /><i /><span>{project.name.toUpperCase()}</span></div>
                    <div className="thumb-body"><div><b /><b /><b /><b /></div><aside><i /><i /><i /></aside></div>
                  </div>
                  <span className="thumb-orbit" />
                  <span className="thumb-index">0{index + 1}</span>
                </div>
                <div className="project-slide-copy">
                  <div className="project-slide-heading"><span>SELECTED WORK / 0{index + 1}</span><h3>{project.name}</h3></div>
                  <p>{project.description}</p>
                  <div className="project-tags">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <div className="project-links"><ProjectLink href={project.demoUrl} tabIndex={visible ? 0 : -1}>Live demo</ProjectLink><ProjectLink href={project.githubUrl} tabIndex={visible ? 0 : -1}>GitHub</ProjectLink></div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="project-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Proyek sebelumnya">←</button>
          <div className="project-dots" aria-label={`Proyek ${activeIndex + 1} dari ${projects.length}`}>
            {projects.map((project, index) => <button type="button" key={project.id} className={index === activeIndex ? "is-active" : ""} onClick={() => setActiveIndex(index)} aria-label={`Lihat proyek ${index + 1}`} aria-current={index === activeIndex ? "true" : undefined} />)}
          </div>
          <span>{String(activeIndex + 1).padStart(2, "0")} <i>/</i> {String(projects.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => move(1)} aria-label="Proyek berikutnya">→</button>
        </div>
      </div>
    </div>
  );
}
