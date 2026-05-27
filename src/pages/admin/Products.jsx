
import { useEffect, useState } from "react";
import { formatPrice } from "../../utils/currency";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 📦 Load products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ➕ RESET FORM
  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("");
    setStock("");
    setImage("");
    setEditId(null);
  };

  // ➕ Add product
  const addProduct = async () => {
  try {
    setLoading(true);

    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("stock", stock);

    // 👇 أهم تعديل هنا
    if (imageFile) {
      formData.append("image", imageFile);
    } else if (image) {
      formData.append("imageUrl", image);;
    }

    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      await fetchProducts();
      resetForm();
    } else {
      console.log(data.message);
    }

  } finally {
    setLoading(false);
  }
};

  const formData = new FormData();

formData.append("name", name);
formData.append("price", price);
formData.append("category", category);
formData.append("stock", stock);

// 🟢 لو فيه صورة جديدة
if (imageFile) {
  formData.append("image", imageFile);
} else if (image) {
  formData.append("imageUrl", image);
}

  // ✏️ Start edit
  const startEdit = (product) => {
    setEditId(product._id);
    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setStock(product.stock);
    setImage(product.image || "");
  };

  // ✏️ Update product
  const updateProduct = async () => {
  setLoading(true);

  const formData = new FormData();

  formData.append("name", name);
  formData.append("price", price);
  formData.append("category", category);
  formData.append("stock", stock);

  // 👇 نفس النظام
  if (imageFile) {
    formData.append("image", imageFile);
  } else if (image) {
    formData.append("imageUrl", image);;
  }

  const res = await fetch(
    `http://localhost:5000/api/products/${editId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (res.ok) {
    await fetchProducts();
    resetForm();
  }

  setLoading(false);
};

  // ❌ Delete product
  const deleteProduct = async (id) => {
    const res = await fetch(
      `http://localhost:5000/api/products/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Admin Products Panel 📦
      </h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">

        <div className="grid grid-cols-4 gap-3">

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="border p-2 rounded col-span-4"
          />

          <input
  type="file"
  onChange={(e) => setImageFile(e.target.files[0])}
  className="border p-2 rounded"
/>

        </div>

        <div className="mt-4 flex gap-3">

          {editId ? (
            <button
              disabled={loading}
              onClick={updateProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          ) : (
            <button
              disabled={loading}
              onClick={addProduct}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          )}

          {editId && (
            <button
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}

        </div>

      </div>

      {/* LIST */}
      <div className="grid gap-3">

        {products.map((p) => (
          <div
            key={p._id}
            className="flex justify-between items-center bg-white p-4 rounded shadow"
          >

            <div className="flex items-center gap-3">

              {p.image && (
  <img
    src={p.image?.url || p.image}
    className="w-16 h-16 object-cover rounded"
  />
)}

              <div>
                <h2 className="font-bold">{p.name}</h2>
                <p className="text-gray-500">
                  {formatPrice(p.price)} | {p.category} | Stock: {p.stock}
                </p>
              </div>

            </div>

            <div className="flex gap-2">

              <button
                onClick={() => startEdit(p)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteProduct(p._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}