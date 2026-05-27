export default function Hero() {
  return (
    <section className="w-full h-[70vh] flex items-center justify-center bg-green-50">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800">
          اجعل منزلك أكثر حياة بالنباتات 🌿
        </h1>

        <p className="text-gray-600 text-lg">
          اكتشف أفضل النباتات الداخلية والخارجية بأسعار مميزة
        </p>

        <button className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
          تسوق الآن
        </button>
      </div>
    </section>
  );
}