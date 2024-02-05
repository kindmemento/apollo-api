import { addIndex } from "../controllers/indexController"
import { Request, Response } from "express"

jest.mock("../models/user.ts", () => ({
	findOne: jest.fn().mockResolvedValue({ id: 1 }),
}))

describe("addIndex", () => {
	it('should return "Index added successfully" for the first index record', async () => {
		const req: Request = { userId: 1, body: { indexDate: "2024-02-01", indexValue: 100 } } as any
		const res: Response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any

		await addIndex(req, res)

		expect(res.status).toHaveBeenCalledWith(201)
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: expect.stringMatching(/Index( and consumption)? added successfully/),
			})
		)
	})

	it('should return "Index and consumption added successfully" for consecutive index records', async () => {
		const req: Request = { userId: 1, body: { indexDate: "2024-02-03", indexValue: 500 } } as any
		const res: Response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any

		await addIndex(req, res)

		expect(res.status).toHaveBeenCalledWith(201)
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				message: expect.stringMatching(/Index( and consumption)? added successfully/),
			})
		)
	})
})
