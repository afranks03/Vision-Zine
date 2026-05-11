'use client';

import { useState } from 'react';
import type { PersonalContent } from '@/lib/supabase/types';
import { Field, SectionShell, inputClass, textareaClass } from './section-shell';

export function PersonalSection({
  zineId,
  initial,
}: {
  zineId: string;
  initial: Partial<PersonalContent>;
}) {
  const [fullName, setFullName] = useState(initial.full_name ?? '');
  const [displayName, setDisplayName] = useState(initial.display_name ?? '');
  const [pronouns, setPronouns] = useState(initial.pronouns ?? '');
  const [location, setLocation] = useState(initial.location ?? '');
  const [birthYear, setBirthYear] = useState(initial.birth_year ? String(initial.birth_year) : '');
  const [shortIntro, setShortIntro] = useState(initial.short_intro ?? '');

  return (
    <SectionShell
      zineId={zineId}
      sectionKey="personal"
      eyebrow="Section 01"
      title={
        <>
          Who&apos;s on the <em>masthead</em>.
        </>
      }
      intro={
        <>
          The basics for the colophon and the cover. You can leave anything blank — we&apos;ll fall
          back to a quiet default.
        </>
      }
      collect={() => ({
        full_name: fullName || undefined,
        display_name: displayName || undefined,
        pronouns: pronouns || undefined,
        location: location || undefined,
        birth_year: birthYear ? Number(birthYear) || undefined : undefined,
        short_intro: shortIntro || undefined,
      })}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" hint="As it should appear in the colophon.">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Adrian Franks"
            className={inputClass}
          />
        </Field>
        <Field
          label="Display name"
          hint="What goes on the cover. Often a shortened version of your full name."
        >
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. A.d."
            className={inputClass}
          />
        </Field>
        <Field label="Pronouns">
          <input
            type="text"
            value={pronouns}
            onChange={(e) => setPronouns(e.target.value)}
            placeholder="e.g. he/him"
            className={inputClass}
          />
        </Field>
        <Field label="Location" hint="Used on the masthead — town, region, or both.">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Brooklyn × Athens"
            className={inputClass}
          />
        </Field>
        <Field label="Birth year" hint="Optional. Used only in templates that include age.">
          <input
            type="number"
            inputMode="numeric"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            placeholder="e.g. 1976"
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Short intro" hint="Two sentences. Goes under your name in the editor's letter.">
        <textarea
          value={shortIntro}
          onChange={(e) => setShortIntro(e.target.value)}
          rows={3}
          placeholder="e.g. A designer and writer. Brooklyn and Athens, in roughly that order."
          className={textareaClass}
        />
      </Field>
    </SectionShell>
  );
}
