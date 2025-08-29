// File: /api/generate.js
// VERSI PERBAIKAN: Menambahkan logika untuk menjawab pertanyaan umum

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

    const modelId = "gemini-1.5-flash-latest";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

    const knowledgeBase = `
        Pertanyaan,Jawaban
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
        Mengapa kita harus latihan simulasi bencana?,Supaya kita siap dan tahu apa yang harus dilakukan jika bencana terjadi.
    `;

    // --- PERUBAHAN UTAMA: Mengganti nama robot menjadi Si Tangguh ---
    const fullPrompt = `
        Kamu adalah Si Tangguh, robot asisten yang ramah untuk anak-anak SD.
        Tugasmu adalah menjawab pertanyaan tentang kesiapsiagaan bencana HANYA BERDASARKAN data CSV berikut.
        
        DATA PENGETAHUAN:
        ---
        ${knowledgeBase}
        ---

        Aturan:
        1. Jawabanmu harus singkat, jelas, dan sesuai dengan data di atas.
        2. Jangan menambah informasi di luar data tersebut.
        3. Jika pertanyaannya bersifat umum seperti 'apa yang kamu tahu?' atau 'jelaskan semua yang kamu tahu', jawab dengan merangkum topik-topik utama dari DATA PENGETAHUAN. Contoh jawaban: 'Tentu! Si Tangguh tahu banyak tentang persiapan bencana, seperti apa itu gempa bumi dan banjir, apa yang harus dilakukan saat evakuasi, dan barang apa saja yang perlu ada di tas siaga bencana. Kamu mau tanya tentang yang mana?'
        4. Jika pertanyaan tidak bisa dijawab dari data, katakan dengan sopan: "Hmm, Si Tangguh belum belajar tentang itu. Coba tanya yang lain ya!"
        
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
