import { Request, Response } from "express"
import { Index } from "../models/index"
import { Consumption } from "../models/consumption"
import { Op } from "sequelize"
import { User } from "../models/user"

export const addIndex = async (req: Request, res: Response) => {
	try {
		const userId = req.userId || req.body.userId // Attempt to extract userId from request headers first, fallback to request body as a failsafe
		const { indexDate, indexValue } = req.body

		if (!userId || !indexDate || !indexValue || indexValue < 0) {
			return res.status(400).json({ error: "Invalid or missing fields in the request body" })
		}

		// To reduce computational cost, return without proceeding if user does not exist
		const existingUser = await User.findOne({ where: { id: userId } })
		if (!existingUser) {
			return res.status(404).json({ error: "User not found" })
		}

		await Index.create({ userId, indexDate, indexValue })

		// Check for previous entries
		let previousIndex = await Index.findOne({
			where: {
				userId,
				indexDate: {
					[Op.lt]: indexDate,
				},
			},
			order: [["indexDate", "DESC"]],
			attributes: ["indexValue", "indexDate"], // Fetch both indexValue and indexDate
		})

		if (!previousIndex) {
			// If no records are found before the current index date, attempt to find the earliest index date after the current index date
			previousIndex = await Index.findOne({
				where: {
					userId,
					indexDate: {
						[Op.gt]: indexDate,
					},
				},
				order: [["indexDate", "ASC"]],
				attributes: ["indexValue", "indexDate"],
			})
		}

		if (!previousIndex) {
			// If this is the first index record, consumption can/will not be recorded and calculated.
			return res.status(201).json({ message: "Index added successfully." })
		}

		// Calculate consumption and create records for each day in between
		const consumptionValue = Math.abs(indexValue - previousIndex.indexValue)
		const startDate = previousIndex.indexDate < indexDate ? previousIndex.indexDate : indexDate
		const endDate = previousIndex.indexDate < indexDate ? indexDate : previousIndex.indexDate
		const consumptionDates = getDatesInRange(startDate, endDate)

		// Insert consumption records for each day in between
		if (consumptionValue > 0 && consumptionDates.length > 0) {
			const consumptionPerDay = consumptionValue / consumptionDates.length
			for (const date of consumptionDates) {
				await Consumption.create({
					userId,
					consumptionDate: date,
					consumptionValue: consumptionPerDay,
				})
			}
			return res.status(201).json({ message: "Index and consumption added successfully." })
		}

		return res.status(201).json({ message: "Index added successfully." })
	} catch (error) {
		console.error("Error adding index:", error)
		return res.status(500).json({ error: "Internal server error" })
	}
}

// Helper function to get dates in range between two dates
const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
	const dates: Date[] = []
	let currentDate = new Date(startDate)
	const end = new Date(endDate)

	// Handle case where start and end dates are the same
	if (currentDate.getTime() === end.getTime()) {
		return [new Date(startDate)]
	}

	while (currentDate < end) {
		dates.push(new Date(currentDate))
		currentDate.setDate(currentDate.getDate() + 1)
	}

	return dates
}

export const deleteIndex = async (req: Request, res: Response) => {
	try {
		const { indexId } = req.params

		// Find index by ID
		const index = await Index.findByPk(indexId)

		if (!index) {
			return res.status(404).json({ error: "Index not found" })
		}

		// Delete index
		await index.destroy()

		return res.status(200).json({ message: "Index deleted successfully" })
	} catch (error) {
		console.error("Error deleting index:", error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
