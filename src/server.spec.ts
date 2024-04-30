import express from "express"
import { handlePOSTAnalysis } from "./api/post-analysis"

jest.mock("express", () => {
    const use = jest.fn()
    const post = jest.fn()
    const listen = jest.fn()
    const json = jest.fn().mockReturnValue("json")

    const express = jest.fn().mockReturnValue({
        use,
        post,
        listen,
    })

    Object.defineProperty(express, "json", {
        value: json,
    })

    return {
        __esModule: true,
        default: express,
    }
})

jest.mock("./api/post-analysis", () => ({
    handlePOSTAnalysis: jest.fn(),
}))

describe("startServer", () => {
    it("creates an express app", () => {
        const { startServer } = require("./server")

        startServer()

        expect(express).toHaveBeenCalled()
    })

    it("parses JSON bodies", () => {
        const { startServer } = require("./server")

        startServer()

        expect(express().use).toHaveBeenCalledWith(express.json())
    })

    it("handles POST requests to /api/analysis", () => {
        const { startServer } = require("./server")

        startServer()

        expect(express().post).toHaveBeenCalledWith("/api/analysis", handlePOSTAnalysis)
    })

    it("listens on port 3000", () => {
        const { startServer } = require("./server")

        startServer()

        expect(express().listen).toHaveBeenCalledWith(3000, expect.any(Function))
    })
})
