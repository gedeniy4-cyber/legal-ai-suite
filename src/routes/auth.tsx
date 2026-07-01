import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Chambers OS" }, { name: "description", content: "Sign in or create your Chambers OS account." }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, isGuest, enterGuest } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/app" });
  }, [user, navigate]);

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in");
    navigate({ to: "/app" });
  };

  const signUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + "/app", data: { full_name: name } },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — check your email to verify");
  };

  const forgot = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Reset link sent");
  };

  const google = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (result.error) {
      setLoading(false);
      return toast.error(String(result.error.message ?? "Google sign-in failed"));
    }
    if (result.redirected) return;
    navigate({ to: "/app" });
  };

  const guest = () => {
    enterGuest();
    toast.success("Guest mode active — unlimited access");
    navigate({ to: "/app" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[--navy-deep]">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[--navy-deep] via-[--navy] to-[--navy-deep] text-white">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[--gold] to-[--gold-soft] grid place-items-center">
            <Sparkles className="h-4 w-4 text-[--navy-deep]" />
          </div>
          Chambers OS
        </Link>
        <div>
          <h2 className="text-4xl font-black leading-tight">Your practice, <span className="gold-text">amplified</span> by AI.</h2>
          <p className="mt-4 text-white/70">Join thousands of legal professionals drafting, researching, and preparing faster with Chambers OS.</p>
        </div>
        <div className="text-xs text-white/50">By Yondela Gedeni · Sponsored by CAPACITI</div>
      </div>

      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md glass border-white/10">
          <CardContent className="pt-6">
            <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup" | "forgot")}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
                <TabsTrigger value="forgot">Forgot</TabsTrigger>
              </TabsList>

              <div className="mt-6 space-y-3">
                <Button variant="outline" className="w-full" onClick={google} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <GoogleIcon />} Continue with Google
                </Button>
                <Button variant="outline" className="w-full opacity-60 cursor-not-allowed" disabled title="Coming soon">
                  <span className="mr-2">🪟</span> Continue with Microsoft (coming soon)
                </Button>
                <Button variant="ghost" className="w-full text-[--gold]" onClick={guest}>
                  Continue as guest — unlimited
                </Button>
              </div>

              <div className="my-6 flex items-center gap-3 text-xs text-white/40"><div className="h-px flex-1 bg-white/10" /> OR <div className="h-px flex-1 bg-white/10" /></div>

              <TabsContent value="signin" className="space-y-3 mt-0">
                <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button className="w-full bg-[--gold] text-[--navy-deep] hover:bg-[--gold]/90" onClick={signIn} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} Sign in
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-3 mt-0">
                <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder="Password (min 6 chars)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button className="w-full bg-[--gold] text-[--navy-deep] hover:bg-[--gold]/90" onClick={signUp} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} Create account
                </Button>
              </TabsContent>

              <TabsContent value="forgot" className="space-y-3 mt-0">
                <Input placeholder="Your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Button className="w-full bg-[--gold] text-[--navy-deep] hover:bg-[--gold]/90" onClick={forgot} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} Send reset link
                </Button>
              </TabsContent>
            </Tabs>
            {isGuest && <div className="mt-4 text-xs text-center text-white/60">You are currently in guest mode.</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
