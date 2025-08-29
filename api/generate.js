// File: /api/generate.js
// VERSI FINAL: Menggunakan struktur dan data sesuai dokumentasi yang diberikan.

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

    const modelId = "gemma-3-1b-it";
    const generateContentApi = "streamGenerateContent";

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:${generateContentApi}?key=${apiKey}`;

    // PERUBAHAN: Menggunakan data Base64 yang sudah ada, tanpa membuat variabel knowledgeBaseCSV
    const knowledgeBaseBase64 = "UGVydGFueWFhbixKYXdhYmFuCkFwYSBpdHUgYmVuY2FuYSBhbGFtPywiQmVuY2FuYSBhbGFtIGFkYWxhaCBrZWphZGlhbiBiZXNhciBkYXJpIGFsYW0geWFuZyBiaXNhIG1lcnVzYWsgbGluZ2t1bmdhbiBkYW4gbWVtYmFoYXlha2FuIG9yYW5nLCBzZXBlcnRpIGdlbXBhLCBiYW5qaXIsIGF0YXUgZ3VudW5nIG1lbGV0dXMuIgpBcGEgaXR1IG1pdGlnYXNpIGJlbmNhbmE/LE1pdGlnYXNpIGJlbmNhbmEgYWRhbGFoIHVzYWhhIHVudHVrIG1lbmd1cmFuZ2kgcmlzaWtvIGJhaGF5YSBzZWJlbHVtIGJlbmNhbmEgdGVyamFkaS4KS2VuYXBhIGtpdGEgaGFydXMgYmVsYWphciB0ZW50YW5nIGJlbmNhbmE/LFN1cGF5YSBraXRhIHRhaHUgY2FyYSBtZWxpbmR1bmdpIGRpcmkgZGFuIG1lbWJhbnR1IG9yYW5nIGxhaW4uCkFwYSB5YW5nIGhhcnVzIGRpbGFrdWthbiBzYWF0IGdlbXBhIGJ1bWk/LCJTZWdlcmEgbGluZHVuZ2kga2VwYWxhLCBiZXJzZW1idW55aSBkaSBiYXdhaCBtZWphLCBkYW4gamFuZ2FuIHBhbmlrLiIKIkthbGF1IGFkYSBiYW5qaXIsIGFwYSB5YW5nIGhhcnVzIGtpdGEgbGFrdWthbj8iLCJQaW5kYWgga2UgdGVtcGF0IHlhbmcgbGViaWggdGluZ2dpIGRhbiBhbWFuLCBqYW5nYW4gbWFpbiBkaSBhaXIgYmFuamlyLiIKQmFnYWltYW5hIHRhbmRhLXRhbmRhIGd1bnVuZyBha2FuIG1lbGV0dXM/LCJBZGEgZ2V0YXJhbiwgc3VhcmEgZ2VtdXJ1aCwgZGFuIGFzYXAga2VsdWFyIGRhcmkgcHVuY2FrIGd1bnVuZy4iCkFwYSBpdHUgZXZha3Vhc2k/LEV2YWt1YXNpIGFkYWxhaCBwaW5kYWgga2UgdGVtcGF0IGFtYW4gc2FhdCBhZGEgYmFoYXlhLgoiS2FsYXUgYWRhIHNpcmluZSBwZXJpbmdhdGFuLCBhcnRpbnlhIGFwYT8iLCJJdHUgdGFuZGEgYWRhIGJhaGF5YSwga2l0YSBoYXJ1cyBzZWdlcmEgbWVuZ2lrdXRpIHBldHVuanVrLiIKQXBhIHlhbmcgaGFydXMgZGliYXdhIHNhYXQgbWVuZ3VuZ3NpPywiQmF3YSBiYXJhbmcgcGVudGluZyBzZXBlcnRpIGFpciBtaW51bSwgbWFrYW5hbiwgb2JhdCwgZGFuIHBha2FpYW4gc2VjdWt1cG55YS4iCiJLYWxhdSBhZGEga2ViYWthcmFuLCBhcGEgeWFuZyBoYXJ1cyBkaWxha3VrYW4/IiwiU2VnZXJhIGtlbHVhciBkYXJpIGJhbmd1bmFuLCB0dXR1cCBoaWR1bmcgZGFuIG11bHV0IGRlbmdhbiBrYWluIGJhc2FoLiIKQXBhIGl0dSB0YXMgc2lhZ2EgYmVuY2FuYT8sVGFzIGJlcmlzaSBiYXJhbmcgcGVudGluZyB5YW5nIHNpYXAgZGliYXdhIHNhYXQgYmVuY2FuYS4KQmFnYWltYW5hIGNhcmEgYW1hbiBrZWx1YXIgc2FhdCBnZW1wYSBkaSBzZWtvbGFoPywiSWt1dGkgZ3VydSwgamFuZ2FuIGJlcmxhcmksIGRhbiBqYWdhIGphcmFrIGRhcmkgYmFuZ3VuYW4uIgpBcGEgeWFuZyB0aWRhayBib2xlaCBkaWxha3VrYW4gc2FhdCBiYW5qaXI/LCJKYW5nYW4gYmVybWFpbiBkaSBhaXIgYmFuamlyLCBqYW5nYW4gbWVuZGVrYXRpIHRpYW5nIGxpc3RyaWsuIgpCYWdhaW1hbmEgY2FyYSBtZW1iYW50dSB0ZW1hbiBzYWF0IGJlbmNhbmE/LEFqYWsgZGlhIGtlIHRlbXBhdCBhbWFuIGRhbiBiZXJpIHNlbWFuZ2F0LgpNZW5nYXBhIGtpdGEgdGlkYWsgYm9sZWggcGFuaWs/LEthcmVuYSBwYW5payBtZW1idWF0IGtpdGEgc3VsaXQgYmVycGlraXIgZGFuIGJlcnRpbmRhayBkZW5nYW4gYmVuYXIuCkFwYSBpdHUgamFsdXIgZXZha3Vhc2k/LEphbGFuIGF0YXUgcnV0ZSB5YW5nIGhhcnVzIGRpbGFsdWkgdW50dWsgbWVudWp1IHRlbXBhdCBhbWFuLgpCYWdhaW1hbmEgY2FyYSB0YWh1IGluZm9ybWFzaSBiZW5jYW5hPywiRGVuZ2FyIGRhcmkgZ3VydSwgb3JhbmcgdHVhLCByYWRpbywgYXRhdSBzaXJpbmUuIgpBcGEgaXR1IGdlbXBhIGJ1bWk/LEdldGFyYW4gZGkgcGVybXVrYWFuIGJ1bWkga2FyZW5hIHBlcmdlcmFrYW4gbGVtcGVuZyBidW1pLgoiS2FsYXUga2l0YSB0ZXJwaXNhaCBkYXJpIG9yYW5nIHR1YSBzYWF0IGJlbmNhbmEsIGFwYSB5YW5nIGhhcnVzIGRpbGFrdWthbj8iLFBlcmdpIGtlIHBvc2tvIGF0YXUgdGVtcGF0IGJlcmt1bXB1bCB5YW5nIGFtYW4uCk1lbmdhcGEga2l0YSBoYXJ1cyBsYXRpaGFuIHNpbXVsYXNpIGJlbmNhbmE/LFN1cGF5YSBraXRhIHNpYXAgZGFuIHRhaHUgYXBhIHlhbmcgaGFydXMgZGlsYWt1a2FuIGppa2EgYmVuY2FuYSB0ZXJqYWRpLgo=";

    const requestBody = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    { "inlineData": { "mimeType": "text/csv", "data": knowledgeBaseBase64 } },
                    { "text": "Kamu adalah Si Tangguh, robot asisten interaktif yang ramah untuk anak-anak SD. \nTugasmu menjawab pertanyaan tentang bencana alam berdasarkan data yang diberikan. \nGunakan bahasa sederhana, jelas, dan menyenangkan. \nJika pertanyaan tidak terkait bencana, katakan dengan sopan bahwa kamu hanya bisa menjawab tentang bencana. \nAjak anak-anak untuk ikut berpikir, misalnya dengan memberi pertanyaan balik sederhana.\n" },
                ]
            },
            {
                "role": "model",
                "parts": [
                    { "text": "Oke, siap! Aku Si Tangguh, robot asisten yang siap membantumu belajar tentang bencana alam. \n\nAyo, mau tanya apa? Jangan ragu-ragu ya! 😊" }
                ]
            },
            {
                "role": "user",
                "parts": [
                    { "text": question }
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

        // Logika untuk menangani respons streaming
        const responseBody = await response.text();
        const chunks = responseBody.match(/\[(.*?)\]/g);
        
        let fullAnswer = "";
        if (chunks) {
            for (const chunk of chunks) {
                try {
                    const parsedChunk = JSON.parse(chunk);
                    const candidate = parsedChunk[0]?.candidates?.[0];
                    if (candidate?.content?.parts?.[0]?.text) {
                        fullAnswer += candidate.content.parts[0].text;
                    }
                } catch(e) {
                    console.error("Could not parse chunk:", chunk);
                }
            }
        }
        
        if (fullAnswer) {
            res.status(200).json({ answer: fullAnswer });
        } else {
            console.error('Unexpected API response structure after processing stream:', responseBody);
            res.status(500).json({ error: 'Failed to parse streaming response from API' });
        }

    } catch (error) {
        console.error('Error calling API:', error);
        res.status(500).json({ error: 'An error occurred while fetching the answer.' });
    }
}

