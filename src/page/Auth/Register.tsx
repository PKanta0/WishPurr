import React ,{ useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterCompo from "./componantAuth/RegisterCompo";
import { API_BASE } from "../../config/api";


const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
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

        if (form.password !== form.confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: form.username,
                    email: form.email,
                    password: form.password,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Register failed");
            }

            navigate("/login");
        } catch (err: any) {
            setError(err.message || "Register failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10">
            <h1 className="text-2xl font-semibold text-center">Register</h1>

            <form
                className="space-y-4 rounded-3xl bg-white p-6 shadow-sm text-sm"
                onSubmit={handleSubmit}
            >
                <RegisterCompo
                    label="Username"
                    placeholder="Username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                />
                <RegisterCompo
                    label="Email"
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                />
                <RegisterCompo
                    label="Password"
                    placeholder="••••••••"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                />
                <RegisterCompo
                    label="Confirm Password"
                    placeholder="••••••••"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
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
                    {loading ? "Creating..." : "Create account"}
                </button>
            </form>
        </div>
    );
};

export default Register;
