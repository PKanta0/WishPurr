import React, { useState } from "react";
import LoginCompo from "./componantAuth/LoginCompo";
import { API_BASE } from "../../config/api";
import { saveAuth } from "../../utils/auth"

const Login = () => {

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Login failed");

            saveAuth(data.token, data.user);

            if (data.user.role === "admin") {
                window.location.href = "/admin";
            } else {
                window.location.href = "/";
            }
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10">
            <h1 className="text-2xl font-semibold text-center">Login</h1>

            <form
                className="space-y-4 rounded-3xl bg-white p-6 shadow-sm text-sm"
                onSubmit={handleSubmit}
            >
                <LoginCompo
                    label="Email"
                    placeholder="you@example.com"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                />
                <LoginCompo
                    label="Password"
                    placeholder="••••••••"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                />

                {error && (
                    <p className="text-xs text-red-500 text-center">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full rounded-full bg-black py-2.5 text-white disabled:opacity-60"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="text-center text-xs text-gray-600">
                ยังไม่มีบัญชี?{" "}
                <a
                    href="/register"
                    className="font-medium underline underline-offset-2"
                >
                    สมัครสมาชิก
                </a>
            </p>
            <p className="text-center text-xs text-gray-600">
                ลืมรหัสผ่าน?{" "}
                <a
                    href="/forgot-password"
                    className="font-medium underline underline-offset-2"
                >
                    กดที่นี่เพื่อกู้รหัสผ่าน
                </a>
            </p>
        </div>
    );
};

export default Login;
