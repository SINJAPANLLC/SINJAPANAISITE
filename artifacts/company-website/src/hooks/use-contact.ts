import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "お名前は2文字以上で入力してください。" }),
  company: z.string().min(1, { message: "会社名を入力してください。" }),
  email: z.string().email({ message: "有効なメールアドレスを入力してください。" }),
  message: z.string().min(10, { message: "お問い合わせ内容は10文字以上で入力してください。" }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (data: ContactFormValues) => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulate successful response
      return { success: true, data };
    },
  });
}
