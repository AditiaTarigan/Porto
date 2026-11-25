"use client";

import { useState, type FormEvent } from "react";
import { profile } from "@/app/data/portfolio";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "opened">("idle");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const subject = `Portfolio inquiry from ${values.get("name")}`;
    const body = `Name: ${values.get("name")}\nEmail: ${values.get("email")}\n\n${values.get("message")}`;
    const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("loading");
    window.setTimeout(() => {
      window.location.href = mailto;
      setStatus("opened");
    }, 250);
  };

  return (
    <div className="contact-form-wrap">
      <p className="contact-email-note">Contact me directly at <a href={`mailto:${profile.email}`}>{profile.email}</a> or drop your info.</p>
      <form className="contact-form" onSubmit={onSubmit}>
        <label>Name<input name="name" autoComplete="name" placeholder="Your name" required minLength={2} /></label>
        <label>Email Address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
        <label>Message<textarea name="message" placeholder="Tell me a little about your idea..." rows={4} required minLength={10} /></label>
        <div className="contact-submit-row">
          <button className="button button-primary" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Opening email…" : "Send Message →"}
          </button>
          <p role="status" aria-live="polite">{status === "opened" ? "Your email draft is ready. Send it from your mail app." : ""}</p>
        </div>
      </form>
    </div>
  );
}
