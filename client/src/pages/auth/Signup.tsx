import React, { useState } from "react";
import { useLocation } from "wouter";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const Signup: React.FC = () => {
  const { signUp, signInWithGoogle } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      await signUp(formData.email, formData.password, {
        username: formData.username,
        full_name: formData.fullName,
      });
      setLocation("/");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <Card className="p-8 max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          <Button type="submit" className="w-full bg-coral text-white">
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 space-y-3">
          <Button
            onClick={signInWithGoogle}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-4 w-4" />
            Continue with Google
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
