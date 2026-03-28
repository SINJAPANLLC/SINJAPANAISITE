import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitContact, contactFormSchema, type ContactFormValues } from "@/hooks/use-contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, Building2, User, Loader2 } from "lucide-react";

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
    <section id="contact" className="py-24 relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-32 -z-10 blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">Contact Us</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
              AIでビジネスを<br />
              <span className="text-gradient">次のステージへ</span>
            </h3>
            <p className="text-foreground/70 text-lg mb-8 leading-relaxed font-light">
              システム開発のご相談、生成AI導入に関するご質問など、お気軽にお問い合わせください。AIの専門家が最適なソリューションをご提案いたします。
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4 glass-panel p-4 rounded-2xl border-white/5 w-fit">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <Mail className="w-5 h-5 text-primary drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
                </div>
                <div>
                  <p className="text-sm text-foreground/60 mb-1">メールでのお問い合わせ</p>
                  <p className="font-bold text-white tracking-wider">contact@sinjapan.work</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-panel p-8 md:p-10 rounded-3xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">お名前 <span className="text-primary">*</span></label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                      <Input 
                        placeholder="山田 太郎" 
                        className="pl-10 h-12 bg-black/40 border-white/10 focus:border-primary focus:ring-primary focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary/50 text-white placeholder:text-white/20 transition-all"
                        {...form.register("name")}
                      />
                    </div>
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">会社名 <span className="text-primary">*</span></label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                      <Input 
                        placeholder="株式会社〇〇" 
                        className="pl-10 h-12 bg-black/40 border-white/10 focus:border-primary focus:ring-primary focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary/50 text-white placeholder:text-white/20 transition-all"
                        {...form.register("company")}
                      />
                    </div>
                    {form.formState.errors.company && (
                      <p className="text-sm text-destructive">{form.formState.errors.company.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">メールアドレス <span className="text-primary">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                    <Input 
                      type="email"
                      placeholder="yamada@example.com" 
                      className="pl-10 h-12 bg-black/40 border-white/10 focus:border-primary focus:ring-primary focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary/50 text-white placeholder:text-white/20 transition-all"
                      {...form.register("email")}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">お問い合わせ内容 <span className="text-primary">*</span></label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                    <Textarea 
                      placeholder="具体的なご相談内容をご記入ください。" 
                      className="pl-10 min-h-[150px] resize-none bg-black/40 border-white/10 focus:border-primary focus:ring-primary focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary/50 text-white placeholder:text-white/20 transition-all"
                      {...form.register("message")}
                    />
                  </div>
                  {form.formState.errors.message && (
                    <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 text-base font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all border-none"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      送信中...
                    </>
                  ) : "送信する"}
                </Button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
