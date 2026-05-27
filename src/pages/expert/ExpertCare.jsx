export default function ExpertCare() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg text-center">
        
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          👨‍🌾 Expert Care
        </h1>

        <p className="text-gray-500 mb-6">
          خدمة متابعة النباتات بواسطة خبراء زراعيين
        </p>

        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl mb-6">
          🚧 هذه الخدمة قيد التطوير
        </div>

        <ul className="text-sm text-gray-700 space-y-2 text-right">
          <li>🌿 متابعة صحة النبات بشكل دوري</li>
          <li>📊 تقارير دقيقة من مختصين</li>
          <li>👨‍🌾 تشخيص الحالات الصعبة</li>
          <li>💬 دعم مباشر مستقبلي</li>
        </ul>

        <button
          disabled
          className="mt-6 bg-gray-300 text-gray-600 px-6 py-3 rounded-xl cursor-not-allowed"
        >
          قريبًا
        </button>

      </div>
    </div>
  );
}