// File: /api/generate.js
// VERSI GEMMA: Menggunakan model Gemma yang gratis.

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

    // --- PERUBAHAN 1: Mengganti Model ID ke Gemma ---
    // Anda bisa coba model lain seperti "gemma-7b-it" jika diperlukan
    const modelId = "gemma-2b-it"; 
    const generateContentApi = "generateContent"; // Tetap menggunakan generateContent untuk Vercel

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:${generateContentApi}?key=${apiKey}`;

    // Basis pengetahuan dalam format CSV
    const knowledgeBaseCSV = `Pertanyaan,Jawaban
Apa itu bencana alam?,"Bencana alam adalah kejadian besar dari alam yang bisa merusak lingkungan dan membahayakan orang, seperti gempa, banjir, atau gunung meletus."
Apa itu mitigasi bencana?,Mitigasi bencana adalah usaha untuk mengurangi risiko bahaya sebelum bencana terjadi.
Kenapa kita harus belajar tentang bencana?,Supaya kita tahu cara melindungi diri dan membantu orang lain.
Apa yang harus dilakukan saat gempa bumi?,"Segera lindungi kepala, bersembunyi di bawah meja, dan jangan panik."
"Kalau ada banjir, apa yang harus kita lakukan?","Pindah ke tempat yang lebih tinggi dan aman, jangan main di air banjir."
Bagaimana tanda-tanda gunung akan meletus?,"Ada getaran, suara gemuruh, dan asap keluar dari puncak gunung."
Apa itu evakuasi?,Evakuasi adalah pindah ke tempat aman saat ada bahaya.
"Kalau ada sirine peringatan, artinya apa?","Itu tanda ada bahaya, kita harus segera mengikuti petunjuk."
Apa yang harus dibawa saat mengungsi?,"Bawa barang penting seperti air minum, makanan, obat, dan pakaian secukupnya."
"Kalau ada kebakaran, apa yang harus dilakukan?","Segera keluar dari bangunan, tutup hidung dan mulut dengan kain basah."
Apa itu tas siaga bencana?,Tas berisi barang penting yang siap dibawa saat bencana.
Bagaimana cara aman keluar saat gempa di sekolah?,"Ikuti guru, jangan berlari, dan jaga jarak dari bangunan."
Apa yang tidak boleh dilakukan saat banjir?,"Jangan bermain di air banjir, jangan mendekati tiang listrik."
Bagaimana cara membantu teman saat bencana?,Ajak dia ke tempat aman dan beri semangat.
Mengapa kita tidak boleh panik?,Karena panik membuat kita sulit berpikir dan bertindak dengan benar.
Apa itu jalur evakuasi?,Jalan atau rute yang harus dilalui untuk menuju tempat aman.
Bagaimana cara tahu informasi bencana?,"Dengar dari guru, orang tua, radio, atau sirine."
Apa itu gempa bumi?,Getaran di permukaan bumi karena pergerakan lempeng bumi.
"Kalau kita terpisah dari orang tua saat bencana, apa yang harus dilakukan?",Pergi ke posko atau tempat berkumpul yang aman.
Mengapa kita harus latihan simulasi bencana?,Supaya kita siap dan tahu apa yang harus dilakukan jika bencana terjadi.`;

    // Mengubah CSV menjadi Base64
    const knowledgeBaseBase64 = Buffer.from(knowledgeBaseCSV).toString('base64');

    // --- PERUBAHAN 2: Menyesuaikan Body Request sesuai format Gemma ---
    const requestBody = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "inlineData": {
                            "mimeType": "text/csv",
                            "data": knowledgeBaseBase64
                        }
                    },
                    {
                        "text": "Kamu adalah Si Tangguh, robot asisten interaktif yang ramah untuk anak-anak SD. \nTugasmu menjawab pertanyaan tentang bencana alam berdasarkan data yang diberikan. \nGunakan bahasa sederhana, jelas, dan menyenangkan. \nJika pertanyaan tidak terkait bencana, katakan dengan sopan bahwa kamu hanya bisa menjawab tentang bencana. \nAjak anak-anak untuk ikut berpikir, misalnya dengan memberi pertanyaan balik sederhana.\n"
                    },
                ]
            },
            {
                "role": "model",
                "parts": [
                    {
                        "text": "Oke, siap! Aku Si Tangguh, robot asisten yang siap membantumu belajar tentang bencana alam. \n\nAyo, mau tanya apa? Jangan ragu-ragu ya! 😊"
                    },
                ]
            },
            {
                "role": "user",
                "parts": [
                    {
                        "text": question // Pertanyaan dari pengguna disisipkan di sini
                    },
                ]
            },
        ],
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error('API Error:', errorBody);
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts[0]) {
            const answerText = result.candidates[0].content.parts[0].text;
            res.status(200).json({ answer: answerText });
        } else {
            console.error('Unexpected API response structure:', result);
            if (result.promptFeedback) {
                 console.error('Prompt Feedback:', result.promptFeedback);
                 return res.status(500).json({ error: 'Jawaban diblokir karena alasan keamanan.' });
            }
            res.status(500).json({ error: 'Failed to parse response from API' });
        }

    } catch (error) {
        console.error('Error calling API:', error);
        res.status(500).json({ error: 'An error occurred while fetching the answer.' });
    }
}

