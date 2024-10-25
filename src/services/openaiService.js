// src/services/openaiService.js
import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || process.env.VUE_APP_OPENAI_API_KEY;
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || process.env.VUE_APP_UNSPLASH_ACCESS_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random';


const fetchUnsplashImage = async (query) => {
    try {
        const response = await axios.get(UNSPLASH_API_URL, {
            params: {
                query, 
                client_id: UNSPLASH_ACCESS_KEY,
                orientation: 'landscape',
            },
        });
        return response.data.urls.regular; 
    } catch (error) {
        console.error("Error fetching Unsplash image:", error);
        return null; 
    }
};

// Main function to get recipe data from OpenAI and Unsplash
export const generateRecipeResponse = async (ingredient, limit = 3) => {
    const query = `
        Find a recipe for ${ingredient}. If it exists, create a list of up to ${limit} related recipes. 
        Format the response as follows:
        {
            "recipe": {
                "title": "Recipe Title",
                "prep_time": "20 minutes",
                "cook_time": "15 minutes",
                "ingredients": ["ingredient1", "ingredient2", ...],
                "instructions": [
                    { "step": 1, "description": "Step description" },
                    ...
                ]
            },
            "related_recipes": [
                {
                    "title": "Related Recipe 1",
                    "prep_time": "10 minutes",
                    "cook_time": "30 minutes",
                    "ingredients": [...],
                    "instructions": [...]
                },
                ...
            ]
        }
        If ${ingredient} cannot be found, return {"recipe": null}.
    `;

    try {
        // Get recipe data from OpenAI
        const openaiResponse = await axios.post(
            OPENAI_API_URL,
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful chef.' },
                    { role: 'user', content: query },
                ],
                temperature: 0,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        const foodData = JSON.parse(openaiResponse.data.choices[0].message.content);

        
        if (foodData?.recipe) {
           
            foodData.recipe.image = await fetchUnsplashImage(foodData.recipe.title);

            
            for (const relatedRecipe of foodData.related_recipes) {
                relatedRecipe.image = await fetchUnsplashImage(relatedRecipe.title);
            }
        }

        return foodData?.recipe ? foodData : { recipe: null };
    } catch (error) {
        console.error("Error generating recipe response:", error);
        return { recipe: null };
    }
};
