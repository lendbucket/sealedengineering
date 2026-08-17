"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitApplication } from "@/app/actions";
import { AVAILABILITY, FIELD_ROLES, IDLE, type FormState } from "@/lib/forms";
import {
  AttributionFields,
  FormError,
  FormSuccess,
  Honeypot,
  RadioGroup,
  SelectField,
  TextArea,
  TextField,
} from "@/components/forms/Fields";

export function ApplicationForm({ path }: { path: string }) {
  const [state, action] = useActionState<FormState, FormData>(submitApplication, IDLE);

  if (state.status === "success") {
    return <FormSuccess heading="Application received" message={state.message} />;
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
        <TextField
          name="phone"
          label="Phone"
          type="tel"
          required
          autoComplete="tel"
          hint="Field work is scheduled by phone."
          error={e.phone}
        />
        <TextField
          name="city"
          label="Where are you based?"
          required
          autoComplete="address-level2"
          hint="City or area. Work is assigned by how far you are from the property."
          error={e.city}
        />
      </div>

      <SelectField
        name="role"
        label="What are you applying for?"
        required
        options={FIELD_ROLES.map((r) => ({ value: r, label: r }))}
        error={e.role}
      />

      <SelectField
        name="availability"
        label="Availability"
        required
        options={AVAILABILITY.map((a) => ({ value: a, label: a }))}
        error={e.availability}
      />

      <RadioGroup
        name="hasVehicle"
        legend="Do you have reliable transport and a valid driver license?"
        required
        options={[
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ]}
        error={e.hasVehicle}
      />

      <TextArea
        name="experience"
        label="Relevant experience"
        rows={5}
        hint="Construction, inspection, surveying, roofing, or trades experience all count. So does being comfortable in a crawl space with a flashlight."
        error={e.experience}
      />

      <TextArea
        name="message"
        label="Anything else"
        rows={3}
        error={e.message}
      />

      <Submit />

      <p className="text-sm leading-relaxed text-ink-soft">
        Field technicians gather evidence and perform measurements. They do not perform engineering
        or issue opinions. All engineering review and every seal is the work of a licensed Texas
        Professional Engineer.
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
      {pending ? "Sending..." : "Send application"}
    </button>
  );
}
