import { object, ValidationError, string } from 'yup'
import { createAnalysis } from '../analysis'
import express from 'express'

export const handlePOSTAnalysis = async (req: express.Request, res: express.Response) => {
    const schema = object().shape({
        imageUrl: string().required(),
    })

    try {
        const { imageUrl } = await schema.validate(req.body)
        const rating = await createAnalysis(imageUrl)

        res.json({ rating })
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json(error)
        } else {
            res.status(500).json({ error: error.message })
        }
    }
}
