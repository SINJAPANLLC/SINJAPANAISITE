import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitContact, contactFormSchema, type ContactFormValues } from "@/hooks/use-contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, Building2, User, Loader2, ArrowRight } from "lucide-react";

export function Contact() {
  const { toast } = useToast();
  const mutation = useSubmitContact();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      message: "",
    },
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
    <section id="contact" className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[800px]">
        
        {/* Left Column - Dark */}
        <div className="bg-[#0a0a0a] text-white px-6 py-24 lg:px-20 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto lg:mx-0"
          >
            <h2 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">Contact Us</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-[1.2] tracking-tight">
              AIでビジネスを<br />次のステージへ
            </h3>
            <p className="text-gray-400 text-lg mb-12 leading-relaxed font-medium">
              システム開発のご相談、生成AI導入に関するご質問など、お気軽にお問い合わせください。AIの専門家が最適なソリューションをご提案いたします。
            </p>
            <div className="space-y-8">
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-bold mb-1">メールでのお問い合わせ</p>
                  <p className="text-lg font-bold tracking-wide">contact@nexus-ai.example.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Form */}
        <div className="px-6 py-24 lg:px-20 bg-white flex flex-col justify-center border-l border-gray-100">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto lg:mx-0 w-full"
          >
            <div className="mb-12">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">お問い合わせフォーム</h4>
              <p className="text-gray-500 font-medium">必要事項をご記入の上、送信してください。</p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">お名前 <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-0 top-3 w-5 h-5 text-gray-400" />
                    <Input 
                      placeholder="山田 太郎" 
                      className="pl-8 h-12 bg-transparent border-0 border-b border-gray-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black transition-colors"
                      {...form.register("name")}
                    />
                  </div>
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500 font-medium">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">会社名 <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Building2 className="absolute left-0 top-3 w-5 h-5 text-gray-400" />
                    <Input 
                      placeholder="株式会社NEXUS" 
                      className="pl-8 h-12 bg-transparent border-0 border-b border-gray-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black transition-colors"
                      {...form.register("company")}
                    />
                  </div>
                  {form.formState.errors.company && (
                    <p className="text-sm text-red-500 font-medium">{form.formState.errors.company.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">メールアドレス <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-0 top-3 w-5 h-5 text-gray-400" />
                  <Input 
                    type="email"
                    placeholder="yamada@example.com" 
                    className="pl-8 h-12 bg-transparent border-0 border-b border-gray-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black transition-colors"
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500 font-medium">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">お問い合わせ内容 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MessageSquare className="absolute left-0 top-3 w-5 h-5 text-gray-400" />
                  <Textarea 
                    placeholder="具体的なご相談内容をご記入ください。" 
                    className="pl-8 pt-3 min-h-[120px] resize-none bg-transparent border-0 border-b border-gray-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black transition-colors"
                    {...form.register("message")}
                  />
                </div>
                {form.formState.errors.message && (
                  <p className="text-sm text-red-500 font-medium">{form.formState.errors.message.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-base font-bold rounded-none bg-black text-white hover:bg-gray-800 tracking-wider flex items-center justify-between px-6 group"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <span className="flex items-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    送信中...
                  </span>
                ) : (
                  <>
                    <span>送信する</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
