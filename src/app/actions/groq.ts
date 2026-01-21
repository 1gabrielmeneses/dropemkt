"use server"

import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "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"
});

export interface EnrichedData {
    category: string;
    subCategory: string; // "Nicho"
    nicheDescription: string;
    contentStrategy: string[];
    location: string;
    targetAudience: string;
    toneOfVoice: string;
    keyCompetitors: string[];
}

export async function enrichClientProfile(
    name: string,
    bio: string,
    username: string,
    postsCount: number,
    followersCount: number
): Promise<EnrichedData> {
    try {
        const prompt = `
        Você é um estrategista especialista em redes sociais. Analise este perfil do Instagram:
        Nome: ${name}
        Username: ${username}
        Bio: ${bio}
        Stats: ${postsCount} posts, ${followersCount} seguidores.

        Retorne APENAS um JSON válido. Responda TUDO EM PORTUGUÊS DO BRASIL.
        {
            "category": "Indústria Principal (ex: Fitness, Tecnologia, Alimentação)",
            "subCategory": "Nicho Específico (ex: Crossfit, SaaS B2B, Confeitaria Vegana)",
            "nicheDescription": "Uma descrição profissional de 1 frase sobre o posicionamento de mercado e público-alvo.",
            "contentStrategy": ["Pilar de Conteúdo 1", "Pilar de Conteúdo 2", "Pilar de Conteúdo 3"],
            "location": "Localização provável baseada na bio ou idioma (ex: São Paulo, Brasil, Global)",
            "targetAudience": "Descrição do público alvo (ex: Mulheres 25-34 anos interessadas em moda sustentável)",
            "toneOfVoice": "Tom de voz recomendado (ex: Descontraído, Profissional, Inspirador)",
            "keyCompetitors": ["Competidor 1", "Competidor 2", "Competidor 3"] // Liste 3 prováveis competidores famosos ou genéricos se não souber
        }
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error("No content from Groq");

        return JSON.parse(content);
    } catch (error) {
        console.error("Groq Enrichment Error:", error);
        return {
            category: "Sem categoria",
            subCategory: "Geral",
            nicheDescription: "Não foi possível analisar o perfil.",
            contentStrategy: ["Conteúdo Geral", "Institucional", "Produtos"],
            location: "Desconhecido",
            targetAudience: "Geral",
            toneOfVoice: "Profissional",
            keyCompetitors: []
        };
    }
}

export async function generateSearchKeywords(
    category: string,
    subCategory: string,
    contentStrategy: string[]
): Promise<string[]> {
    try {
        const prompt = `
        Analise a categoria, subcategoria e estratégia de conteúdo de um perfil e gere exatamente as 3 melhores palavras-chave (keywords) para encontrar perfis similares no Instagram Search.
        
        Categoria: ${category}
        Subcategoria: ${subCategory}
        Estratégia: ${contentStrategy.join(", ")}
        
        Retorne APENAS o JSON no formato:
        {
            "keywords": ["palavra1", "palavra2", "palavra3"]
        }
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) return [category, subCategory].filter(Boolean);

        const data = JSON.parse(content);
        return data.keywords || [];
    } catch (error) {
        console.error("Groq Keyword Generation Error:", error);
        return [category, subCategory].filter(Boolean);
    }
}
