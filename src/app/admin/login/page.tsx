"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/v1/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Invalid credentials.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <p className="font-semibold text-[#1a1a1a] text-sm">Font License Checker</p>
          </Link>
          <h1 className="text-2xl font-bold text-[#1a1a1a] mt-6 mb-1">Admin login</h1>
          <p className="text-sm text-[#6b6b6b]">Sign in to manage fonts and issues</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="input-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              required
              autoFocus
              placeholder="admin@example.com"
              className="form-input"
            />
          </div>

          <div>
            <label className="input-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              required
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary w-full mt-2"
          >
            {status === "loading" ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center mt-4">
          <Link href="/" className="text-xs text-[#9b9b9b] hover:text-[#6b6b6b] transition-colors">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
