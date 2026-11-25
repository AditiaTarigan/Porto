"use client";

import { skills } from "@/app/data/portfolio";
import { useShowSkill } from "@/app/components/keyboard-world";

export default function SkillButtons() {
  const showSkill = useShowSkill();

  return (
    <ul className="skill-access-list" aria-label="Browse technologies">
      {skills.map((skill) => (
        <li key={skill.id}>
          <button type="button" onClick={() => showSkill(skill)} aria-label={`Show ${skill.name} details`}>
            <span>{skill.mark}</span>{skill.name}<kbd>{skill.hotkey.toUpperCase()}</kbd>
          </button>
        </li>
      ))}
    </ul>
  );
}
