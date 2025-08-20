// File: /api/generate.js

export default async function handler(request, response) {
  // Hanya izinkan metode request POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  // Ambil API key secara aman dari Environment Variable di Vercel
  const apiKey = process.env.GEMINI_API_KEY;

  // Jika API Key tidak di-set di Vercel, kirim error
  if (!apiKey) {
    return response.status(500).json({ error: 'API key is not configured on the server.' });
  }

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  try {
    // Ambil 'prompt' yang dikirim dari front-end (index.html)
    const { prompt } = request.body;

    // Jika tidak ada prompt, kirim error
    if (!prompt) {
      return response.status(400).json({ error: 'Prompt is required' });
    }

    // Kirim permintaan ke Google Gemini API dari sisi server yang aman
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    // Jika respons dari Google tidak berhasil, teruskan errornya
    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error('Gemini API Error:', errorData);
      return response.status(geminiResponse.status).json({ error: 'Failed to fetch from Gemini API' });
    }

    const result = await geminiResponse.json();
    
    // Pastikan ada kandidat jawaban sebelum mengirim
    if (!result.candidates || result.candidates.length === 0) {
        return response.status(500).json({ error: 'No response from Gemini API' });
    }
    const text = result.candidates[0].content.parts[0].text;

    // Kirim kembali jawaban dari Gemini ke front-end
    return response.status(200).json({ answer: text });

  } catch (error) {
    console.error('Internal Server Error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
