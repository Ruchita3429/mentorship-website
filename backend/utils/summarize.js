const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Summarize text using OpenAI API
 * @param {string} text - Text to summarize
 * @returns {Promise<string>} - Summary in 3-6 bullet points, under 120 words
 */
const summarizeText = async (text) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes text into 3-6 concise bullet points. Keep the total summary under 120 words. Use bullet point format with • prefix.'
        },
        {
          role: 'user',
          content: `Please summarize the following text into 3-6 bullet points (under 120 words total):\n\n${text}`
        }
      ],
      temperature: 0.5,
      max_tokens: 300
    });

    const summary = completion.choices[0].message.content.trim();
    return summary;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    throw new Error('Failed to generate summary');
  }
};

module.exports = {
  summarizeText
};
