"use client";

import { useActiveSkill, useKeyboardPress } from "@/app/components/keyboard-world";

export default function BongoCat() {
  const activeSkill = useActiveSkill();
  const isPressed = useKeyboardPress();

  return (
    <div className={`bongo-cat${isPressed ? " is-typing" : ""}`} aria-label={isPressed && activeSkill ? `Kucing mengetik ${activeSkill.name}` : "Maskot kucing"}>
      <svg viewBox="0 0 260 190" role="img" aria-hidden="true">
        <ellipse cx="132" cy="166" rx="88" ry="12" fill="#000" opacity=".25" />
        <path d="M66 101 57 43l50 24m42 34 45-47-1 66" fill="#f0ebe2" stroke="#21232a" strokeWidth="8" strokeLinejoin="round" />
        <path d="m69 68 22 10m85 3-18 17" stroke="#f19a72" strokeWidth="8" strokeLinecap="round" />
        <path d="M60 117c0-39 31-67 73-67s75 28 75 67v33H60z" fill="#f0ebe2" stroke="#21232a" strokeWidth="8" />
        <path d="M92 104q8-10 16 0m43 0q8-10 16 0" fill="none" stroke="#21232a" strokeWidth="7" strokeLinecap="round" />
        <path d="M123 116q8-7 16 0l-8 8z" fill="#f19a72" />
        <path d="M130 124q-2 12-14 8m14-8q2 12 14 8" fill="none" stroke="#21232a" strokeWidth="4" strokeLinecap="round" />
        <path d="M73 129 44 138m30-4-30 8m141-13 31 8m-31-4 31 8" stroke="#21232a" strokeWidth="3" strokeLinecap="round" />
        <rect x="44" y="145" width="173" height="20" rx="9" fill="#c7f36b" stroke="#21232a" strokeWidth="6" />
        <path className="cat-paw cat-paw-left" d="M91 139q0-25 16-25t16 25" fill="#f0ebe2" stroke="#21232a" strokeWidth="7" strokeLinecap="round" />
        <path className="cat-paw cat-paw-right" d="M140 139q0-25 16-25t16 25" fill="#f0ebe2" stroke="#21232a" strokeWidth="7" strokeLinecap="round" />
        <path d="M102 151h9m18 0h9m18 0h9" stroke="#21232a" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}
