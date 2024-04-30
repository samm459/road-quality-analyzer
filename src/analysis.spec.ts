import { createAnalysis } from "./analysis"
import { OpenAI } from 'openai'

jest.mock('openai', () => {
    const create = jest.fn().mockResolvedValue({
        choices: [
            {
                message: {
                    content: "5",
                },
            },
        ],
    })

    const OpenAI = jest.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create,
            },
        },
    }))

    return { OpenAI }
})

describe("createAnalysis", () => {
    it("throws an error if the OPENAI_API_KEY environment variable is not set", async () => {
        const imageUrl = "https://example.com/image.jpg"
        await expect(createAnalysis(imageUrl)).rejects.toThrow('Missing OPENAI_API_KEY environment variable')
    })

    it("configures the openai client with the OPENAI_API_KEY environment variable", async () => {
        const originalOpenAIApiKey = process.env.OPENAI_API_KEY
        process.env.OPENAI_API_KEY = "test-key"

        const imageUrl = "https://example.com/image.jpg"

        await createAnalysis(imageUrl)

        expect(OpenAI).toHaveBeenCalledWith({ apiKey: "test-key" })

        process.env.OPENAI_API_KEY = originalOpenAIApiKey
    })

    it("generates a response from the GPT-4 model", async () => {
        const imageUrl = "https://example.com/image.jpg"

        await createAnalysis(imageUrl)

        expect(OpenAI).toHaveBeenCalledWith({ apiKey: process.env.OPENAI_API_KEY })
        expect(new OpenAI().chat.completions.create).toHaveBeenCalledWith({
            model: 'gpt-4-turbo',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: "text",
                            text: expect.any(String),
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": imageUrl
                            }
                        }
                    ]
                },
            ],
        })
    })

    it("extracts the rating from the response", async () => {
        const imageUrl = "https://example.com/image.jpg"
        const rating = await createAnalysis(imageUrl)

        expect(rating).toBe(5)
    })

    it("throws an error if the response is not valid", async () => {
        const imageUrl = "https://example.com/image.jpg";

        (OpenAI as any as jest.Mock).mockImplementationOnce(() => ({
            chat: {
                completions: {
                    create: jest.fn().mockResolvedValue({
                        choices: [
                            {
                                message: {
                                    content: "invalid",
                                },
                            },
                        ],
                    }),
                },
            },
        }))

        await expect(createAnalysis(imageUrl)).rejects.toThrow('Invalid response')
    })
})
