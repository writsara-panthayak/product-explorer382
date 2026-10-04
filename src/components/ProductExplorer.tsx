"use client";

import { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import ProductSearchForm from "./ProductSearchForm";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type {
  Product, ProductDraft, ProductList, SearchQuery,
} from "@/lib/products";

type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const editing = products.find((item) => item.id === editingId) ?? null;

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
    );
    setStatus("error");
  }

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");
    setEditingId(null);
    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  // หัวข้อ 4.1 โหลดอัตโนมัติครั้งเดียวตอนเปิดหน้า
  // ตั้ง State ในคอลแบ็ก ไม่เรียก loadProducts ตรง ๆ ภายใน Effect
  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  // หัวข้อ 3.7 และ 4.2 เพิ่ม และแก้ไขรายการ (สร้าง Array ใหม่เสมอ)
  function saveProduct(draft: ProductDraft) {
    if (editingId === null) {
      setProducts([...products, { ...draft, id: Date.now() }]);
    } else {
      setProducts(
        products.map((item) =>
          item.id === editingId ? { ...draft, id: editingId } : item
        )
      );
      setEditingId(null);
    }
  }

  // หัวข้อ 4.2 ลบรายการ และออกจากโหมดแก้ไขหากกำลังแก้รายการนั้นอยู่
  function removeProduct(id: number) {
    setProducts(products.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  }

  return (
    <main>
      <h1>รายการสินค้า</h1>

      <button
        type="button"
        onClick={() => loadProducts(defaultQuery)}
        disabled={status === "loading"}
      >
        {status === "loading" ? "กำลังโหลด" : "โหลดข้อมูลซ้ำ"}
      </button>

      <ProductSearchForm onSearch={loadProducts} />

      {/* key เปลี่ยนเมื่อเปลี่ยนรายการที่แก้ไข ทำให้ฟอร์มถูกสร้างใหม่
          และอ่าน defaultValues ใหม่ทุกครั้ง */}
      <ProductForm
        key={editingId ?? "new"}
        editing={editing}
        onSave={saveProduct}
        onCancel={() => setEditingId(null)}
      />

      <section aria-live="polite">
        {status === "loading" && <p>กำลังโหลดข้อมูล</p>}
        {status === "error" && <p role="alert">{errorMessage}</p>}
        {status === "ready" && products.length === 0 && (
          <p>ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
        )}
        {status === "ready" && products.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>ชื่อสินค้า</th>
                <th>ราคา</th>
                <th>คงเหลือ</th>
                <th>หมวดหมู่</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.price}</td>
                  <td>{item.stock}</td>
                  <td>{item.category}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => setEditingId(item.id)}
                    >
                      แก้ไข
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProduct(item.id)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
