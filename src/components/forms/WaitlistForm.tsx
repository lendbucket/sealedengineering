"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitWaitlist } from "@/app/actions";
import { IDLE, TIMELINES, VOLUMES, type FormState } from "@/lib/forms";
import {
  AttributionFields,
  FormError,
  FormSuccess,
  Honeypot,
  SelectField,
  TextArea,
  TextField,
} from "@/components/forms/Fields";

/**
 * The prelaunch waitlist form.
 *
 * The service options are passed in from the server rather than imported here,
 * for the same reason the header nav is: importing the services dataset into a
 * client component would ship every word of ten service pages to the browser to
 * render ten <option> elements.
 */
export function WaitlistForm({
  serviceOptions,
  path,
  defaultService,
}: {
  serviceOptions: { value: string; label: string }[];
  path: string;
  defaultService?: string;
}) {
  const [state, action] = useActionState<FormState, FormData>(submitWaitlist, IDLE);

  if (state.status === "success") {
    return (
      <FormSuccess
        heading="You are on the list"
        message={state.message}
      />
    );
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
          autoComplete="tel"
          hint="Optional. Faster than email when a document is time critical."
          error={e.phone}
        />
        <TextField
          name="company"
          label="Company"
          autoComplete="organization"
          hint="Optional. Leave blank if this is for your own property."
          error={e.company}
        />
      </div>

      <SelectField
        name="service"
        label="What do you need sealed?"
        required
        options={serviceOptions}
        defaultValue={defaultService}
        placeholder="Choose the deliverable"
        error={e.service}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="city"
          label="Texas city or area"
          autoComplete="address-level2"
          hint="Where the property is, not where you are."
          error={e.city}
        />
        <SelectField
          name="timeline"
          label="How soon do you need it?"
          required
          options={TIMELINES.map((t) => ({ value: t, label: t }))}
          error={e.timeline}
        />
      </div>

      <SelectField
        name="volume"
        label="How many of these do you order in a month?"
        options={VOLUMES.map((v) => ({ value: v, label: v }))}
        placeholder="Choose one"
        hint="Businesses ordering repeat volume are set up as accounts rather than one time orders."
        error={e.volume}
      />

      <TextArea
        name="message"
        label="Anything we should know"
        rows={4}
        hint="Optional. A plan review comment, an underwriter condition, or a deadline is the most useful thing you can paste here."
        error={e.message}
      />

      <Submit />

      <p className="text-sm leading-relaxed text-ink-soft">
        Joining the waitlist does not create an engineer client relationship and is not a request
        for engineering services. Sealed Engineering is not offering or performing engineering
        services until firm registration is granted.
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
      {pending ? "Joining..." : "Join the waitlist"}
    </button>
  );
}
