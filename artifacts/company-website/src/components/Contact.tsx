import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitContact, contactFormSchema, type ContactFormValues } from "@/hooks/use-contact";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight } from "lucide-react";

export function Contact() {
  const { toast } = useToast();
  const mutation = useSubmitContact();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", company: "", email: "", message: "" },
  });

  const onSubmit = (data: ContactFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "送信完了しました",
          description: "お問い合わせありがとうございます。担当者より順次ご連絡いたします。",
        });
        form.reset();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "エラーが発生しました",
          description: "しばらく時間をおいてから再度お試しください。",
        });
      },
    });
  };

  return (
    <section id="contact" className="py-24 bg-[#f8f9fa] border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">Contact</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">お問い合わせ</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-start">

          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            <p className="text-sm text-gray-500 leading-relaxed">
              AI導入のご相談、サービスに関するご質問など、お気軽にお問い合わせください。専任担当者が丁寧にご対応いたします。
            </p>

            <div className="flex flex-col gap-6">
              <div className="border-l-2 border-gray-200 pl-4">
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Tel</p>
                <p className="text-sm font-bold text-gray-800">050-5526-9906</p>
                <p className="text-sm font-bold text-gray-800">046-212-2325</p>
              </div>
              <div className="border-l-2 border-gray-200 pl-4">
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Fax</p>
                <p className="text-sm font-bold text-gray-800">046-212-2326</p>
              </div>
              <div className="border-l-2 border-gray-200 pl-4">
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Email</p>
                <p className="text-sm font-bold text-gray-800">info@sinjapanai.site</p>
              </div>
              <div className="border-l-2 border-gray-200 pl-4">
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">受付時間</p>
                <p className="text-sm font-bold text-gray-800">9:00 〜 21:00</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 bg-white p-10 border border-gray-100"
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-7">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-500 tracking-wider">
                    お名前 <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="山田 太郎"
                    className="h-11 rounded-none border-gray-200 bg-gray-50 focus-visible:ring-0 focus-visible:border-gray-900 transition-colors text-sm"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-500 tracking-wider">
                    会社名 <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="株式会社〇〇"
                    className="h-11 rounded-none border-gray-200 bg-gray-50 focus-visible:ring-0 focus-visible:border-gray-900 transition-colors text-sm"
                    {...form.register("company")}
                  />
                  {form.formState.errors.company && (
                    <p className="text-xs text-red-500">{form.formState.errors.company.message}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 tracking-wider">
                  メールアドレス <span className="text-red-400">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="yamada@example.com"
                  className="h-11 rounded-none border-gray-200 bg-gray-50 focus-visible:ring-0 focus-visible:border-gray-900 transition-colors text-sm"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 tracking-wider">
                  お問い合わせ内容 <span className="text-red-400">*</span>
                </label>
                <Textarea
                  placeholder="ご相談内容をご記入ください。"
                  className="min-h-[130px] resize-none rounded-none border-gray-200 bg-gray-50 focus-visible:ring-0 focus-visible:border-gray-900 transition-colors text-sm"
                  {...form.register("message")}
                />
                {form.formState.errors.message && (
                  <p className="text-xs text-red-500">{form.formState.errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="h-12 w-full bg-gray-900 text-white text-sm font-bold tracking-wider flex items-center justify-between px-6 hover:bg-black transition-colors duration-200 disabled:opacity-60 group"
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2 mx-auto">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    送信中...
                  </span>
                ) : (
                  <>
                    <span>送信する</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>

            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
