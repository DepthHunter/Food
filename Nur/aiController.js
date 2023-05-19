const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: '',
});

const openai = new OpenAIApi(configuration);

exports.getMealRecommendations = async (req, res) => {
    const { dietaryPreferences } = req.body;
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Give me ${dietaryPreferences} meals ingredients in russsian language`,
            max_tokens: 200,
            n: 1,
            stop: null,
            temperature: 0.5,
        });

        const suggestion = response.data.choices[0].text.trim();
        res.status(200).json({ suggestion: suggestion });
    } catch (error) {
        console.error("Error fetching suggestions from OpenAI API:", error);
        res.status(500).json({ error: "Error fetching suggestions from OpenAI API" });
    }
}

