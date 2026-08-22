"use client";

import { useActionState } from "react";
import { createSponsorAction } from "./actions";

export function SponsorForm() {
  const [state, formAction, pending] = useActionState(createSponsorAction, undefined);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-border bg-surface p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">Nome do patrocinador</label>
          <input name="name" required className="w-full rounded-md border border-border px-3 py-2 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">Site ou Instagram (opcional)</label>
          <input
            name="websiteUrl"
            type="url"
            placeholder="https://instagram.com/patrocinador"
            className="w-full rounded-md border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground">Logo (opcional)</label>
        <input
          name="logo"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted">PNG, JPEG, WEBP ou GIF, até 5MB. Sem logo, aparece só o nome.</p>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-success">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {pending ? "Salvando..." : "Adicionar patrocinador"}
      </button>
    </form>
  );
}
