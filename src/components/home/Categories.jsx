const categories = [
  "Indoor Plants",
  "Outdoor Plants",
  "Flowers",
  "Succulents",
  "Decorative"
];

export default function Categories() {
  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4">التصنيفات</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="p-4 bg-white shadow rounded-xl text-center cursor-pointer hover:shadow-lg transition"
          >
            {cat}
          </div>
        ))}
      </div>
    </section>
  );
}