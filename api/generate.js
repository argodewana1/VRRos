// File: /api/generate.js
// VERSI PERBAIKAN: Disederhanakan untuk stabilitas dan keandalan

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("API key not configured on Vercel.");
        return res.status(500).json({ error: 'API key not configured' });
    }

    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    // Menggunakan model yang stabil dan terbukti
    const modelId = "gemini-1.5-flash-latest";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

    // --- PERUBAHAN UTAMA: Prompt disederhanakan ---
    // Instruksi persona dan pertanyaan pengguna digabung menjadi satu prompt sederhana.
    const fullPrompt = `
        Kamu adalah ROS (Robot Of Safety), robot asisten yang ramah untuk anak-anak SD.
        Tugasmu adalah menjawab pertanyaan tentang kesiapsiagaan bencana.
        Gunakan bahasa yang sederhana, singkat, jelas, dan menyenangkan.
        Jika pertanyaan tidak terkait bencana, katakan dengan sopan bahwa kamu hanya bisa menjawab tentang bencana.
        
        Jawab pertanyaan berikut: "${question}"
    `;

    const requestBody = {
        contents: [{
            parts: [{ text: fullPrompt }]
        }]
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error('Gemini API Error:', errorBody);
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts[0]) {
            const answerText = result.candidates[0].content.parts[0].text;
            res.status(200).json({ answer: answerText });
        } else {
            console.error('Unexpected Gemini API response structure:', result);
            if (result.promptFeedback) {
                 console.error('Prompt Feedback:', result.promptFeedback);
                 return res.status(500).json({ error: 'Jawaban diblokir karena alasan keamanan.' });
            }
            res.status(500).json({ error: 'Failed to parse response from Gemini API' });
        }

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'An error occurred while fetching the answer.' });
    }
}
