import express from 'express'
import { handlePOSTAnalysis } from './api/post-analysis'

export const startServer = () => {
    const app = express()

    app.use(express.json())
    app.post('/api/analysis', handlePOSTAnalysis)

    return app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000')
    })
}

