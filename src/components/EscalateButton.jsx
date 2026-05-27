import axios from "axios";

export default function EscalateButton({ message, image, userId }) {
  const sendToExpert = async () => {
    try {
      await axios.post("http://localhost:5000/api/expert/create", {
        userId,
        message,
        image,
        status: "pending",
      });

      alert("تم تحويل الحالة إلى خبير 👨‍🌾");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء التحويل");
    }
  };

  return (
    <button
      onClick={sendToExpert}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm"
    >
      👨‍🌾 تحويل إلى خبير بشري
    </button>
  );
}