import { useAuthStore } from "../store/authStore";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function AIDoctor() {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);

  const [chat, setChat] = useState(() => {
    const saved = localStorage.getItem("plant_ai_chat");
    return saved ? JSON.parse(saved) : [];
  });

  const chatRef = useRef(null);
  const fileInputRef = useRef(null);
  const user = useAuthStore((state) => state.user);

  // =========================
  // Auto scroll (smooth)
  // =========================
  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chat]);

  // =========================
  // Save chat
  // =========================
  useEffect(() => {
    localStorage.setItem("plant_ai_chat", JSON.stringify(chat));
  }, [chat]);

  // =========================
  // Welcome message
  // =========================
  useEffect(() => {
    if (chat.length === 0) {
      setChat([
        {
          type: "ai",
          message: `🌿 أهلاً ${user?.name || "بك"}
أنا Plant Doctor AI
مساعد ذكي متخصص في رعاية النباتات 🌱

يمكنني مساعدتك في:
• تشخيص أمراض النباتات
• اصفرار وذبول الأوراق
• مشاكل الري والتسميد
• الحشرات والفطريات
• تقديم حلول وعلاج للنباتات

📷 يمكنك إرسال:
• وصف للمشكلة
• صورة للنبات
• أعراض النبات

👨‍🌾 Expert Care
نظام الخبراء الزراعيين البشريين
سيكون متوفر قريبًا للحالات المتقدمة.`,         
 time: getTime(),
        },
      ]);
    }
  }, []);

  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const quickQuestions = [
    "ورق النبات أصفر",
    "النبات بيذبل",
    "فيه حشرات",
    "كم مرة أروي؟",
  ];

  const clearChat = () => {
    localStorage.removeItem("plant_ai_chat");
    setChat([]);
  };

  // =========================
  // Normalize AI response
  // =========================
  const formatAI = (data) => {
    if (typeof data === "string") return data;

    if (data?.type === "escalate") return data.message;

    if (typeof data === "object") {
      return `
🌿 التشخيص: ${data.diagnosis || "غير محدد"}
⚠️ الخطورة: ${data.severity || "غير معروف"}
🔍 السبب: ${data.cause || "غير واضح"}

💊 العلاج:
${data.treatment?.map(t => `• ${t}`).join("\n") || "لا يوجد"}

🎯 الثقة: ${data.confidence ?? 0}%
      `;
    }

    return "حدث خطأ في التحليل";
  };

  // =========================
  // SEND MESSAGE
  // =========================
  const handleSend = async (customMsg) => {
    if (loading) return;

    const finalMessage = customMsg || message;
    if (!finalMessage && !image) return;

    const userMsg = {
      type: "user",
      message: finalMessage,
      image: image ? URL.createObjectURL(image) : null,
      time: getTime(),
    };

    setChat((prev) => [...prev, userMsg]);
    setMessage("");

    const currentImage = image;
    setImage(null);

    setLoading(true);
    setTyping(true);

    try {
      let imageUrl = null;

      if (currentImage) {
        const form = new FormData();
        form.append("file", currentImage);

        const upload = await axios.post(
          "http://localhost:5000/api/upload",
          form
        );

        imageUrl = upload.data.url;
      }

      const res = await axios.post(
        "http://localhost:5000/api/ai/diagnose",
        {
          message: finalMessage,
          image: imageUrl,
        }
      );

      const aiMsg = {
        type: "ai",
        message: formatAI(res.data.result),
        time: getTime(),
      };

      setChat((prev) => [...prev, aiMsg]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        {
          type: "ai",
          message: "⚠️ حصل خطأ في الاتصال",
          time: getTime(),
        },
      ]);
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">

      {/* HEADER */}
      <div className="p-4 border-b bg-white flex justify-between">
        <h1 className="font-bold text-green-700">🌿 Plant AI Doctor</h1>

        <button
          onClick={clearChat}
          className="text-sm text-red-500"
        >
          Clear
        </button>
      </div>

      {/* CHAT */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line shadow ${
                msg.type === "user"
                  ? "bg-green-600 text-white"
                  : "bg-white border"
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  className="rounded-lg mb-2 max-h-60"
                />
              )}

              {msg.message}

              <div className="text-[10px] opacity-50 mt-2">
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {typing && (
          <div className="text-gray-500 text-sm">
            🌿 AI is analyzing...
          </div>
        )}
      </div>

      {/* QUICK */}
      <div className="p-2 flex gap-2 flex-wrap">
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="text-xs bg-green-100 px-3 py-1 rounded-full"
          >
            {q}
          </button>
        ))}
      </div>

      {/* INPUT */}
      <div className="p-4 border-t flex gap-2 bg-white">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border px-4 py-2 rounded-xl"
          placeholder="اسأل عن نباتك..."
        />

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          onClick={() => fileInputRef.current.click()}
          className="px-3 border rounded-xl"
        >
          📷
        </button>

        <button
          onClick={() => handleSend()}
          className="px-4 bg-green-600 text-white rounded-xl"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}