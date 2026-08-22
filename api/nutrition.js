export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No food text provided' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `You are a nutrition expert. Parse this food description and return ONLY a JSON array of food items with their nutritional values per the quantity specified. Be accurate with Australian/common food items.

Food description: "${text}"

Return ONLY this JSON format, no other text:
[
  {
    "name": "Food name with quantity",
    "quantity": 100,
    "unit": "g",
    "calories": 165,
    "protein": 31,
    "carbs": 0,
    "fat": 3.6
  }
]

Rules:
- If no quantity specified, use a standard serving size
- All nutritional values are for the TOTAL quantity specified (not per 100g)
- Be realistic and accurate
- Common Australian foods: vegemite, tim tams, meat pies, sausage rolls etc
- For drinks use ml as unit
- Round to 1 decimal place`
        }]
      })
    });

    const data = await response.json();
    const content = data.content[0].text;

    // Parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Invalid response format');

    const foods = JSON.parse(jsonMatch[0]);
    res.status(200).json({ foods });

  } catch (error) {
    console.error('Nutrition API error:', error);
    res.status(500).json({ error: 'Failed to parse nutrition data' });
  }
}
