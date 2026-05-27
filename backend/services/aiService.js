import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.1-8b-instant";

// ========================================
// 🌿 Plant Keywords Filter
// ========================================
const isPlantRelated = (text = "") => {
  const keywords = [
    // عربي
    "نبات",
    "زرع",
    "زراعة",
    "ورق",
    "أوراق",
    "اصفرار",
    "ذبول",
    "ري",
    "سماد",
    "تسميد",
    "حشرات",
    "فطريات",
    "تربة",
    "نخلة",
    "شجرة",
    "زهرة",
    "بقع",
    "عفن",
    "جذور",
    "ساق",

    // English
    "plant",
    "leaf",
    "soil",
    "watering",
    "fertilizer",
    "fungus",
    "yellow",
    "roots",
    "tree",
    "flower",
    "agriculture",
  ];

  const lower = text.toLowerCase();

  return keywords.some((k) =>
    lower.includes(k.toLowerCase())
  );
};

// ========================================
// 🌿 SYSTEM PROMPT
// ========================================
const systemPrompt = `
أنت Plant Doctor AI 🌿

مهمتك:
تشخيص مشاكل النباتات والزراعة فقط.

🚫 ممنوع تمامًا:
- كرة القدم
- البرمجة
- الترجمة
- السياسة
- الأخبار
- الطب البشري
- التكنولوجيا
- أي شيء خارج النباتات

إذا كان السؤال خارج النباتات:
ارجع JSON فقط بالشكل التالي:

{
  "type": "out_of_scope",
  "message": "أنا متخصص فقط في النباتات والزراعة 🌿"
}

================================

📌 قواعد الرد:

- ارجع JSON فقط
- بدون markdown
- بدون شرح خارج JSON
- بدون backticks

================================

📌 شكل الرد الطبيعي:

{
  "type": "ai",
  "diagnosis": "",
  "severity": "low | medium | high",
  "cause": "",
  "treatment": ["", "", ""],
  "confidence": 0,
  "needs_human": false,
  "human_reason": ""
}

================================

📌 قواعد التشخيص:

- low = مشكلة بسيطة
- medium = مشكلة متوسطة
- high = خطر على النبات

================================

📌 confidence:

رقم من 0 → 100

- الحالة الواضحة = confidence عالي
- الحالة غير الواضحة = confidence منخفض

================================

📌 escalation:

إذا:
- الحالة معقدة
- أو يوجد صورة
- أو confidence أقل من 40

اجعل:

"needs_human": true

================================

📌 لو المستخدم أرسل صورة:

لا تقل أنك حللت الصورة بدقة.
بل اعتبرها "وصف بصري مبدئي".

================================

📌 العلاج:
- خطوات قصيرة
- عملية
- بدون إطالة

================================

📌 مثال صحيح:

{
  "type": "ai",
  "diagnosis": "اصفرار بسبب زيادة الري",
  "severity": "medium",
  "cause": "تشبع التربة بالمياه",
  "treatment": [
    "تقليل الري",
    "تحسين تصريف التربة",
    "إزالة الأوراق التالفة"
  ],
  "confidence": 82,
  "needs_human": false,
  "human_reason": ""
}
`;

// ========================================
// 🌿 Diagnose Function
// ========================================
export const diagnosePlant = async ({
  message,
  image,
}) => {
  try {
    const text = message?.trim() || "";

    // ========================================
    // Empty Request
    // ========================================
    if (!text && !image) {
      return {
        type: "out_of_scope",
        message:
          "🌿 اكتب سؤالك عن النباتات أو الزراعة",
      };
    }

    // ========================================
    // Out of scope filter
    // ========================================
    if (!image && !isPlantRelated(text)) {
      return {
        type: "out_of_scope",
        message:
          "أنا متخصص فقط في النباتات والزراعة 🌿",
      };
    }

    // ========================================
    // Build Prompt
    // ========================================
    const userPrompt = image
      ? `
يوجد صورة نبات.

الوصف النصي:
${text || "لا يوجد وصف"}

قدم تشخيص مبدئي فقط.
`
      : text;

    // ========================================
    // AI Request
    // ========================================
    const response =
      await client.chat.completions.create({
        model: MODEL,
        temperature: 0.3,
        max_tokens: 500,

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

    // ========================================
    // RAW RESPONSE
    // ========================================
    const raw =
      response.choices?.[0]?.message?.content
        ?.replace(/```json/g, "")
        ?.replace(/```/g, "")
        ?.trim() || "";

    let result;

    // ========================================
    // JSON Parse
    // ========================================
    try {
      result = JSON.parse(raw);
    } catch (err) {
      console.log("❌ AI PARSE ERROR:");
      console.log(raw);

      result = {
        type: "ai",
        diagnosis: "تعذر تحليل الحالة",
        severity: "medium",
        cause: "تنسيق غير متوقع من الذكاء الاصطناعي",
        treatment: [
          "أعد كتابة السؤال بشكل أوضح",
          "اذكر أعراض النبات بالتفصيل",
          "حاول مرة أخرى",
        ],
        confidence: 20,
        needs_human: true,
        human_reason: "AI parsing failed",
      };
    }

    // ========================================
    // Auto Escalation
    // ========================================
    if (result.confidence < 40) {
      result.needs_human = true;
      result.human_reason =
        "Low confidence diagnosis";
    }

    if (image) {
      result.needs_human = true;

      if (!result.human_reason) {
        result.human_reason =
          "Image requires expert review";
      }
    }

    // ========================================
    // Final Return
    // ========================================
    return result;
    
  } catch (error) {
    console.error("AI ERROR:", error);

    return {
      type: "error",
      result: {
        type: "ai",
        diagnosis: "حدث خطأ مؤقت",
        severity: "low",
        cause: "فشل الاتصال بالخدمة",
        treatment: [
          "أعد المحاولة بعد قليل",
        ],
        confidence: 0,
        needs_human: true,
        human_reason: "Server error",
      },
    };
  }
};