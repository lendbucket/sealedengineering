"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitOrder } from "@/app/actions";
import { IDLE, type FormState } from "@/lib/forms";
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

/**
 * The live-mode order form.
 *
 * Built now, behind the launch flag, so the shape is settled before the week it
 * goes live rather than during it. Files upload straight to Supabase storage
 * through a one-time signed URL obtained from /api/upload; the browser never
 * holds a storage credential and the resulting object keys ride along as hidden
 * fields.
 */
export function OrderForm({
  serviceOptions,
  path,
  defaultService,
}: {
  serviceOptions: { value: string; label: string }[];
  path: string;
  defaultService?: string;
}) {
  const [state, action] = useActionState<FormState, FormData>(submitOrder, IDLE);
  const [files, setFiles] = useState<{ name: string; path: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;
    setUploading(true);
    setUploadError(null);

    for (const file of picked) {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ filename: file.name, size: file.size }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload could not be prepared.");

        const put = await fetch(data.signedUrl, { method: "PUT", body: file });
        if (!put.ok) throw new Error(`Upload failed for ${file.name}.`);

        setFiles((prev) => [...prev, { name: file.name, path: data.path }]);
      } catch (err) {
        setUploadError((err as Error).message);
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  if (state.status === "success") {
    return <FormSuccess heading="Order received" message={state.message} />;
  }

  const e = state.fieldErrors || {};

  return (
    <form action={action} className="relative space-y-5" noValidate>
      <Honeypot />
      <AttributionFields path={path} />
      {files.map((f) => (
        <input key={f.path} type="hidden" name="file_paths" value={f.path} readOnly />
      ))}

      {state.status === "error" && !state.fieldErrors && <FormError message={state.message} />}

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
          name="contactName"
          label="Contact name"
          required
          autoComplete="name"
          error={e.contactName}
        />
        <TextField
          name="company"
          label="Company"
          autoComplete="organization"
          error={e.company}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          hint="Where the sealed document is sent."
          error={e.email}
        />
        <TextField name="phone" label="Phone" type="tel" required autoComplete="tel" error={e.phone} />
      </div>

      <TextField
        name="propertyAddress"
        label="Property address"
        required
        autoComplete="street-address"
        hint="The address the document is about. Wind speed and exposure are looked up from it."
        error={e.propertyAddress}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="city"
          label="City"
          required
          autoComplete="address-level2"
          error={e.city}
        />
        <TextField
          name="postalCode"
          label="ZIP"
          autoComplete="postal-code"
          error={e.postalCode}
        />
      </div>

      <RadioGroup
        name="rush"
        legend="Is this time critical?"
        options={[
          { value: "no", label: "Standard" },
          { value: "yes", label: "Rush, there is a deadline" },
        ]}
        defaultValue="no"
        error={e.rush}
      />

      <div>
        <label htmlFor="order-files" className="block text-sm font-semibold text-seal-800">
          Upload your documents
        </label>
        <p className="mt-1.5 text-sm text-ink-soft">
          Plans, photographs, cut sheets, plan review comments, or an underwriter condition. PDF,
          images, DWG, DXF, Office files, and ZIP up to 40 MB each.
        </p>
        <input
          ref={inputRef}
          id="order-files"
          type="file"
          multiple
          onChange={onPick}
          className="mt-2.5 block w-full min-h-11 rounded-[var(--radius-control)] border border-line-strong bg-paper-card px-3.5 py-2.5 text-base text-ink file:mr-3 file:rounded file:border-0 file:bg-seal-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-seal-800"
        />
        {uploading && (
          <p role="status" className="mt-2 text-sm text-ink-soft">
            Uploading...
          </p>
        )}
        {uploadError && (
          <p role="alert" className="mt-2 text-sm font-medium text-danger">
            {uploadError}
          </p>
        )}
        {files.length > 0 && (
          <ul className="mt-3 space-y-1.5 text-sm text-ink">
            {files.map((f) => (
              <li key={f.path}>Attached: {f.name}</li>
            ))}
          </ul>
        )}
      </div>

      <TextArea
        name="notes"
        label="Anything we should know"
        rows={5}
        hint="Paste the plan review comment or the underwriter condition verbatim. It is the single most useful thing in this form."
        error={e.notes}
      />

      <Submit />

      <p className="text-sm leading-relaxed text-ink-soft">
        An engineer seals what the evidence supports. If the evidence does not support the
        conclusion you were hoping for, you receive the reason and what would change it, not a
        signature.
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
      {pending ? "Submitting..." : "Submit order"}
    </button>
  );
}
