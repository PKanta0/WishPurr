import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const API_BASE = "http://localhost:4000";

type Product = {
    product_id: number;
    name: string;
    price: number;
    image_cover: string;
    category_name?: string;
};

export default function AllProducts() {

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE}/products`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to load products");
                setProducts(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return <div className="px-10 py-10">Loading products...</div>;
    }

    if (error) {
        return <div className="px-10 py-10 text-red-500">{error}</div>;
    }


    return (
        <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
            {/* หัวข้อ + filter แบบง่าย ๆ */}
            <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">สินค้า Wish Purr</h1>
                    <p className="text-sm text-gray-600">
                        เลือกสูตรที่เหมาะกับลูกแมวและแมวโตของคุณ
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                    <button className="rounded-full border border-gray-800 px-4 py-1">
                        ทั้งหมด
                    </button>
                    <button className="rounded-full border border-gray-300 px-4 py-1">
                        สำหรับลูกแมว
                    </button>
                    <button className="rounded-full border border-gray-300 px-4 py-1">
                        สำหรับแมวโต
                    </button>
                    <button className="rounded-full border border-gray-300 px-4 py-1">
                        สูตรพิเศษ
                    </button>
                </div>
            </section>

            {/* Grid การ์ดสินค้า */}
            <section className="grid gap-6 md:grid-cols-3">
                {products.map((p) => (
                    <Link
                        key={p.product_id}
                        to={`/product/${p.product_id}`}
                        className="rounded-3xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        {/* รูปสินค้า */}
                        <div className="flex h-48 w-full items-center justify-center rounded-2xl bg-[#f4f2ec]">
                            <img
                                src={p.image_cover}
                                alt={p.name}
                                className="h-full w-auto rounded-[24px] object-contain"
                            />
                        </div>


                        {/* ข้อมูลสินค้า */}
                        <div className="mt-4 space-y-1">
                            <p className="text-xs uppercase tracking-wide text-gray-500">
                                {p.category_name === "ลูกแมว"
                                    ? "สำหรับลูกแมว"
                                    : p.category_name === "แมวโต"
                                        ? "สำหรับแมวโต"
                                        : "สูตรพิเศษ"}
                            </p>

                            <h2 className="text-sm font-semibold line-clamp-2">{p.name}</h2>
                            <p className="text-sm font-semibold text-[#5b6b32]">
                                {p.price.toLocaleString()} THB
                            </p>
                        </div>
                    </Link>
                ))}
            </section>
        </div>
    );
}






