"use client";

import { useEffect, useId, useRef } from "react";

export default function ConfirmationModal({ open, title, description, context, cancelLabel, confirmLabel, onCancel, onConfirm }: {
  open: boolean;
  title: string;
  description: string;
  context?: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    cancelRef.current?.focus();
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, [open]);

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} aria-describedby={descriptionId} onCancel={(event) => { event.preventDefault(); onCancel(); }} onKeyDown={(event) => {
      if (event.key !== "Tab") return;
      const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }} className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-stone-200 bg-white p-5 text-slate-900 shadow-xl backdrop:bg-slate-900/50 sm:p-7">
      <h2 id={titleId} className="text-xl font-bold">{title}</h2>
      {context && <p className="mt-2 text-sm font-semibold text-brand">{context}</p>}
      <p id={descriptionId} className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button ref={cancelRef} type="button" onClick={onCancel} className="min-h-12 flex-1 rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">{cancelLabel}</button>
        <button type="button" onClick={onConfirm} className="min-h-12 flex-1 rounded-xl border-2 border-red-700 bg-red-50 px-4 py-3 font-semibold text-red-800 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2">{confirmLabel}</button>
      </div>
    </dialog>
  );
}
