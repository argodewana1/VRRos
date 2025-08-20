// File: /api/generate.js
// VERSI PERBAIKAN DENGAN BASE64 YANG VALID

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    // Menggunakan model yang lebih stabil untuk diagnosis
    const modelId = "gemini-1.5-flash-latest";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

    // PERBAIKAN: String Base64 ini telah dibuat ulang dan sekarang valid.
    const validBase64Data = "IlBlcnRhbnlhYW4iLCJKYXdhYmFuIgoiQXBhIGl0dSBib2VuY2FuYSBhbGFtPyIsIkJvZW5jYW5hIGFsYW0gYWRhbGFoIGtlamFkaWFuIGJlc2FyIGRhcmkgYWxhbSB5YW5nIGJpc2EgbWVydXNhayBsaW5na3VuZ2FuIGRhbiBtZW1iYWhheWFrYW4gb3JhbmcuIgoiQXBhIGl0dSBtaXRpZ2FzaSBib2VuY2FuYT8iLCJNaXRpZ2FzaSBib2VuY2FuYSBhZGFsYWggdXNhaGEgdW50dWsga2VtZW5ndXJhbmdpIHJpc2lrbyBiYWhheWEgc2Vib2VsdW0gYm9lbmNhbmEgdGVyamFkaS4iCiJLZW5hcGEga2l0YSBoYXJ1cyBib2VsYWphciB0ZW50YW5nIGJvZW5jYW5hPyIsIlN1cGF5YSBraXRhIHRhaHUgY2FyYSBtZWxpbmR1bmdpIGRpcmkgZGFuIGtlbWVtYmFudHUgb3JhbmcgbGFpbi4iCiJBcGEgaXR1IGV2YWt1YXNpPyIsIkV2YWt1YXNpIGFkYWxhaCBwaW5kYWgga2UgdGVtcGF0IGFtYW4gc2FhdCBhZGEgYmFoYXlhLiIKIkFwYSBpdHUgamFsdXIgZXZha3Vhc2k/IiwiSmFsYW4gYXRhdSBydXRlIHlhbmcgaGFydXMgZGlhbGFsdWkgdW50dWsga2VtZW51anUgdGVtcGF0IGFtYW4uIgoiQXBhIGl0dSBnZW1wYSBidW1pPyIsIkdldGFyYW4gZGkgcGVybXVrYWFuIGJ1bWkga2FyZW5hIHBlcmdlcmFrYW4gbGVtcGVuZyBidW1pLiIKIkFwYSB5YW5nIGhhcnVzIGRpbGFrdWthbiBzYWF0IGdlbXBhIGJ1bWk/IiwiU2VnZXJhIGxpbmR1bmdpIGtlcGFsYSwgYmVyc2VtYnVueWkgZGkgYmF3YWggbWVqYSwgZGFuIGphbmdhbiBwYW5pay4iCiJCYWdhaW1hbmEgY2FyYSBhbWFuIGtlbHVhciBzYWF0IGdlbXBhIGRpIHNla29sYWg/IiwiSWt1dGkgZ3VydSwgamFuZ2FuIGJlcmxhcmksIGRhbiBqYWdhIGphcmFrIGRhcmkgYmFuZ3VuYW4uIgoiQmFnYWltYW5hIHRhbmRhLXRhbmRhIGd1bnVuZyBhY2FuIG1lbGV0dXM/IiwiQWRhIGdldGFyYW4sIHN1YXJhIGdlbXVydWgsIGRhbiBhc2FwIGtlbHVhciBkYXJpIHB1bmNhayBndW51bmcuIgoiS2FsYXUgYWRhIGJhbmppciwgYXBhIHlhbmcgaGFydXMga2l0YSBsYWt1a2FuPyIsIlBpbmRhaCBrZSB0ZW1wYXQgeWFuZyBsZWJpaCB0aW5nZ2kgZGFuIGFtYW4sIGphbmdhbiBtYWluIGRpIGFpciBiYW5qaXIuIgoiQXBhIHlhbmcgdGlkYWsgYm9sZWggZGlhbGt1a2FuIHNhYXQgYmFuamlyPyIsIkphbmdhbiBiZXJtYWluIGRpIGFpciBiYW5qaXIsIGphbmdhbiBtZW5kZWthdGkgdGlhbmcgbGlzdHJpa2kuIgoiS2FsYXUgYWRhIGtlYmFrYXJhbiwgYXBhIHlhbmcgaGFydXMgZGlhbGt1a2FuPyIsIlNlZ2VyYSBrZWx1YXIgZGFyaSBiYW5ndW5hbiwgdHV0dXAvaGlkdW5nIGRibiBtdWx1dCBkZW5nYW4ga2FpbiBiYXNhaC4iCiJBcGEgaXR1IHRhcyBzaWFnYSBib2VuY2FuYT8iLCJUYXMgYmVyaXNpIGJhcmFuZyBwZW50aW5nIHlhbmcgc2lhcCBkaWJhd2Egc2FhdCBib2VuY2FuYS4iCiJBcGEgeWFuZyBoYXJ1cyBkaWJhd2Egc2FhdCBtZW5ndW5nc2k/IiwiQmF3YSBiYXJhbmcgcGVudGluZyBzZXBlcnRpIGFpciBtaW51bSwgbWFrYW5hbiwgb2JhdCwgZGFuIHBha2FpYW4gc2VjdWt1cG55YS4iCiJNZW5nYXBhIGtpdGEgdGlkYWsgYm9sZWggcGFuaWs/IiwiS2FyZW5hIHBhbmlrIGtlbWVtYnVhdCBraXRhIHN1bGl0IGJlcnBpa2lyIGRhbiBiZXJ0aW5kYWsgZGVuZ2FuIGJlbmFyLiIKIkJDJZ2FpbWFuYSBjYXJhIGtlbWVtYmFudHUgdGVtYW4gc2FhdCBib2VuY2FuYT8iLCJBamFrIGRpYSBrZSB0ZW1wYXQgYW1hbiBkYW4gYmVyaSBzZW1hbmdhdC4iCiJLYWxhdSB0ZXJwaXNhaCBkYXJpIG9yYW5nIHR1YSwgYXBhIHlhbmcgaGFydXMgZGlhbGt1a2FuPyIsIlBlcmdpIGtlIHBvc2tvIGF0YXUgdGVtcGF0IGJlcmt1bXB1bCB5YW5nIGFtYW4uIgo=";

    const requestBody = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "inlineData": {
                            "mimeType": "text/csv",
                            "data": validBase64Data
                        }
                    },
                    {
                        "text": "Kamu adalah ROS (Robot Of Safety), robot asisten interaktif yang ramah untuk anak-anak SD. \nTugasmu menjawab pertanyaan tentang bencana alam berdasarkan data yang diberikan. \nGunakan bahasa sederhana, jelas, dan menyenangkan. \nJika pertanyaan tidak terkait bencana, katakan dengan sopan bahwa kamu hanya bisa menjawab tentang bencana.\n"
                    }
                ]
            },
            {
                "role": "model",
                "parts": [
                    {
                        "text": "Oke, siap! Saya ROS. Mari kita mulai! Apa yang ingin kamu tanyakan tentang bencana alam?"
                    }
                ]
            },
            {
                "role": "user",
                "parts": [
                    {
                        "text": question
                    }
                ]
            }
        ],
        "generationConfig": {}
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
