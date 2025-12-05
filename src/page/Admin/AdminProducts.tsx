import React, { useEffect, useState } from "react";
import { API_BASE } from "../../config/api";
import { getToken } from "../../utils/auth";
import { AdminProduct, FormState } from "../../utils/Types"

export default function AdminProducts() {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<FormState>({
        name: "",
        price: "",
        image_cover: "",
        category_name: "ลูกแมว",
    });

    const token = getToken();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/products`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "โหลดสินค้าล้มเหลว");
            setProducts(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "โหลดสินค้าล้มเหลว");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setEditingId(null);
        setForm({
            name: "",
            price: "",
            image_cover: "",
            category_name: "ลูกแมว",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            alert("กรุณาเข้าสู่ระบบแอดมินก่อน");
            return;
        }

        const body = {
            name: form.name,
            price: Number(form.price),
            image_cover: form.image_cover || null,
            category_name: form.category_name,
        };

        const url =
            editingId === null
                ? `${API_BASE}/products`
                : `${API_BASE}/products/${editingId}`;

        const method = editingId === null ? "POST" : "PUT";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "บันทึกสินค้าไม่สำเร็จ");

            await fetchProducts();
            resetForm();
        } catch (err: any) {
            alert(err.message || "บันทึกสินค้าไม่สำเร็จ");
        }
    };

    const handleEdit = (p: AdminProduct) => {
        setEditingId(p.product_id);
        setForm({
            name: p.name,
            price: String(p.price),
            image_cover: p.image_cover || "",
            category_name: p.category_name || "ลูกแมว",
        });
    };

    const handleDelete = async (id: number) => {
        if (!token) {
            alert("กรุณาเข้าสู่ระบบแอดมินก่อน");
            return;
        }
        if (!confirm("ต้องการลบสินค้านี้ใช่ไหม?")) return;

        try {
            const res = await fetch(`${API_BASE}/products/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "ลบสินค้าไม่สำเร็จ");

            await fetchProducts();
        } catch (err: any) {
            alert(err.message || "ลบสินค้าไม่สำเร็จ");
        }
    };

    if (loading) return <p className="p-4">กำลังโหลดสินค้า...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">จัดการสินค้า</h2>

            {/* ฟอร์ม เพิ่ม/แก้ไข */}
            <form
                onSubmit={handleSubmit}
                className="space-y-3 rounded-2xl bg-white p-4 shadow-sm text-sm"
            >
                <div className="grid gap-3 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-xs text-gray-600">ชื่อสินค้า</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full rounded-full border px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs text-gray-600">ราคา (บาท)</label>
                        <input
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full rounded-full border px-3 py-2"
                            required
                            min={0}
                        />
                    </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-xs text-gray-600">
                            หมวดหมู่สินค้า
                        </label>
                        <select
                            name="category_name"
                            value={form.category_name}
                            onChange={handleChange}
                            className="w-full rounded-full border px-3 py-2"
                        >
                            <option value="ลูกแมว">สำหรับลูกแมว</option>
                            <option value="แมวโต">สำหรับแมวโต</option>
                            <option value="สูตรพิเศษ">สูตรพิเศษ</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs text-gray-600">
                            รูปภาพ (path หรือ URL)
                        </label>
                        <input
                            name="image_cover"
                            value={form.image_cover}
                            onChange={handleChange}
                            className="w-full rounded-full border px-3 py-2"
                            placeholder="/img/product.png"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="rounded-full bg-black px-4 py-2 text-xs font-medium text-white"
                    >
                        {editingId === null ? "เพิ่มสินค้า" : "บันทึกการแก้ไข"}
                    </button>
                    {editingId !== null && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-full border px-4 py-2 text-xs"
                        >
                            ยกเลิกแก้ไข
                        </button>
                    )}
                </div>
            </form>

            {/* ตารางสินค้า */}
            <div className="overflow-x-auto rounded-2xl bg-white p-4 shadow-sm text-sm">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b text-xs text-gray-500">
                            <th className="py-2">ชื่อสินค้า</th>
                            <th className="py-2">หมวดหมู่</th>
                            <th className="py-2">ราคา</th>
                            <th className="py-2">รูปภาพ</th>
                            <th className="py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.product_id} className="border-b last:border-0">
                                <td className="py-2 pr-3">{p.name}</td>
                                <td className="py-2 pr-3">
                                    {p.category_name || "-"}
                                </td>
                                <td className="py-2 pr-3">{p.price.toLocaleString()} THB</td>
                                <td className="py-2 pr-3">
                                    {p.image_cover ? (
                                        <span className="text-xs text-gray-500">
                                            {p.image_cover}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">ไม่มี</span>
                                    )}
                                </td>
                                <td className="py-2 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(p)}
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        แก้ไข
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(p.product_id)}
                                        className="text-xs text-red-600 hover:underline"
                                    >
                                        ลบ
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-4 text-center text-gray-500">
                                    ยังไม่มีสินค้าในระบบ
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
