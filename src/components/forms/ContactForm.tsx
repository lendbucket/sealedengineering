"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact } from "@/app/actions";
import { CONTACT_TOPICS, IDLE, type FormState } from "@/lib/forms";
import {
  AttributionFields,
  FormError,
  FormSuccess,
  Honeypot,
  SelectField,
  TextArea,
  TextField,
} from "@/components/forms/Fields";

export function ContactForm({ path }: { path: string }) {
  const [state, action] = useActionState<FormState, FormData>(submitContact, IDLE);

  if (state.status === "success") {
    return <FormSuccess heading="Message received" message={state.message} />;
  }

  const e = state.fieldErrors || {};

  return (
    <form action={action} className="relative space-y-5" noValidate>
      <Honeypot />
      <AttributionFields path={path} />

      {state.status === "error" && !state.fieldErrors && <FormError message={state.message} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" label="Your name" required autoComplete="name" error={e.name} />
        <TextField
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          error={e.email}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="phone" label="Phone" type="tel" autoComplete="tel" error={e.phone} />
        <TextField
          name="company"
          label="Company"
          autoComplete="organization"
          error={e.company}
        />
      </div>

      <SelectField
        name="topic"
        label="What is this about?"
        required
        options={CONTACT_TOPICS.map((t) => ({ value: t, label: t }))}
        error={e.topic}
      />

      <TextArea
        name="message"
        label="Message"
        required
        rows={6}
        hint="If a permit office or an underwriter has written you a condition, pasting it verbatim gets a far more useful answer than describing it."
        error={e.message}
      />

      <Submit />

      <p className="text-sm leading-relaxed text-ink-soft">
        Sending a message does not create an engineer client relationship and nothing sent back is
        an engineering opinion about a specific property.
      </p>
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--radius-control)] bg-seal-800 px-5 py-3 text-[0.9375rem] font-semibold text-on-seal transition-colors hover:bg-seal-700 disabled:opacity-70 sm:w-auto"
    >
      {pending ? "Sending..." : "Send message"}
    </button>
  );
}
