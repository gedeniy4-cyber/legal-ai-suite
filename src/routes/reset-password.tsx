import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — Chambers OS" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({ to: "/app" });
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[--navy-deep] p-6">
      <Card className="w-full max-w-md glass border-white/10">
        <CardContent className="pt-6 space-y-3">
          <h1 className="text-xl font-bold">Set a new password</h1>
          <Input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button className="w-full bg-[--gold] text-[--navy-deep] hover:bg-[--gold]/90" onClick={submit} disabled={loading}>Update password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
