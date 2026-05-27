const products = [1, 2, 3, 4];

export default function FeaturedProducts() {
  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4">منتجات مميزة</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <div
            key={p}
            className="border rounded-xl p-3 bg-white shadow hover:shadow-lg transition"
          >
            <div className="h-32 bg-gray-100 rounded-lg mb-2"></div>
            <h3 className="font-semibold">Plant Name</h3>
            <p className="text-green-600 font-bold">$20</p>
          </div>
        ))}
      </div>
    </section>
  );
}