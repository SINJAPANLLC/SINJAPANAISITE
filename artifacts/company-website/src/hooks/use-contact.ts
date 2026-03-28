import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "お名前は2文字以上で入力してください。" }),
  company: z.string().min(1, { message: "会社名を入力してください。" }),
  email: z.string().email({ message: "有効なメールアドレスを入力してください。" }),
  message: z.string().min(10, { message: "お問い合わせ内容は10文字以上で入力してください。" }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

const STORAGE_KEY = "sin_japan_contacts";

export function saveContactLocal(data: ContactFormValues) {
  const existing = getContacts();
  const newEntry = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newEntry, ...existing]));
  return newEntry;
}

export function getContacts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Contact submission failed");
      }
      saveContactLocal(data);
      return res.json();
    },
  });
}
