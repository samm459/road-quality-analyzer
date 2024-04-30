import express from "express"
import { handlePOSTAnalysis } from "./post-analysis"
import { createAnalysis } from "../analysis"
import { ValidationError } from "yup"

jest.mock("../analysis", () => ({
    createAnalysis: jest.fn(),
}))

describe("handlePOSTAnalysis", () => {
    it("returns a 400 error if the request body is invalid", async () => {
        const req = { body: {} } as express.Request
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as express.Response

        await handlePOSTAnalysis(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(expect.any(ValidationError))
    })

    it("returns a 500 error if an unexpected error occurs", async () => {
        const req = { body: { imageUrl: "https://example.com/image.jpg" } } as express.Request
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as express.Response

        (createAnalysis as jest.Mock).mockRejectedValueOnce(new Error("Test error"))

        await handlePOSTAnalysis(req, res)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ error: "Test error" })
    })

    it("calls createAnalysis with the imageUrl from the request body", async () => {
        const req = { body: { imageUrl: "https://example.com/image.jpg" } } as express.Request
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as express.Response

        await handlePOSTAnalysis(req, res)

        expect(createAnalysis).toHaveBeenCalledWith("https://example.com/image.jpg")
    })

    it("returns the analysis rating", async () => {
        const req = { body: { imageUrl: "https://example.com/image.jpg" } } as express.Request
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as express.Response

        (createAnalysis as jest.Mock).mockResolvedValueOnce(5)

        await handlePOSTAnalysis(req, res)

        expect(res.json).toHaveBeenCalledWith({ rating: 5 })
    })
})
