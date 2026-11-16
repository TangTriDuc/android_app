require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post('/medicine-info', async (req, res) => {
  try {
    const { medicineName, ocrText, language } = req.body;

    //Change VN / En
    const answerLanguage = language === 'en' ? 'English' : 'Vietnamese';

    if (!medicineName?.trim()) {
      return res.status(400).json({
        message: 'Thiếu tên thuốc',
      });
    }

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content: `
Bạn là trợ lý cung cấp thông tin thuốc.
Không tự đoán khi thiếu thông tin.
Không đưa liều dùng cá nhân.
Không chẩn đoán bệnh.
Giữ nguyên tên thuốc theo ảnh, không dịch tên thuốc.
Không dùng Markdown. Không dùng dấu **, *, #.
          `.trim(),
        },
        {
          role: 'user',
          content: `
Tên thuốc từ ảnh:
${medicineName}

Nội dung OCR từ ảnh:
${ocrText || 'Không có'}

Ngôn ngữ trả lời:
${answerLanguage}

Hãy trả lời bằng ${answerLanguage}.
Giữ nguyên tên thuốc đúng như sau: "${medicineName}".
Không dịch tên thuốc.

Hãy trả lời ngắn gọn theo đúng form này:
${
  language === 'en'
    ? `- Medicine name:
- Common uses:
- Notes when using:
- Warnings to ask a doctor:
- Information is for reference only.`
    : `- Tên thuốc là:
- Công dụng thường gặp:
- Lưu ý khi dùng:
- Cảnh báo cần hỏi bác sĩ:
- Thông tin chỉ mang tính tham khảo.`
}

Không dùng Markdown. Không dùng dấu **, *, #.
          `.trim(),
        },
      ],
    });

    const info =
      completion.choices[0]?.message?.content ||
      'Không có thông tin trả về từ AI';

    const cleanInfo = info.replace(/\*\*/g, '');

    res.json({ info: cleanInfo });
  } catch (error) {
    console.error('Groq medicine info error:', error);

    res.status(500).json({
      message: 'Không lấy được thông tin thuốc',
    });
  }
});

app.post('/extract-medicine-name', async (req, res) => {
  try {
    const { ocrText } = req.body;

    if (!ocrText?.trim()) {
      return res.status(400).json({
        message: 'OCR text is required',
      });
    }

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content: `
You extract the main medicine/product name from OCR text on medicine packaging.

Return only the main product name. No explanation.

Rules:
- Prefer the brand/product name printed on the package.
- If a dosage is part of the product name, keep it. Example: "Cataflam 25".
- If a form label is next to the brand, keep it. Example: OCR has "EYE DROPS" and "V.ROHTO", return "Eye Drops V.Rohto".
- Ignore words like NEW, NEND, FOR, CONTAINS, pharmacy, website, usage, symptoms, ingredients, package quantity.
- Do not return descriptions such as "EYESTRAIN CONGESTION", "ban theo don", "Lo 100 vien nen".
- If OCR contains both a description and a brand, return the brand.
- Fix obvious OCR casing/spaces for the name only.
- If you cannot identify a medicine/product name, return an empty string.
          `.trim(),
        },
        {
          role: 'user',
          content: ocrText,
        },
      ],
      temperature: 0,
    });

    const medicineName = completion.choices[0]?.message?.content?.trim() || '';

    res.json({ medicineName });
  } catch (error) {
    console.error('Groq extract medicine name error:', error);

    res.status(500).json({
      message: 'Unable to extract medicine name',
    });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log('Groq AI server đang chạy tại cổng 3001');
});
