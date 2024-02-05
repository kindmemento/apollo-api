import { Request, Response } from "express"
import { Index } from "../models/index"
import { Consumption } from "../models/consumption"
import { Op } from "sequelize"
import { User } from "../models/user"

export const addIndex = async (req: Request, res: Response) => {
	try {
		const userId = req.userId || req.body.userId
		const { indexDate, indexValue } = req.body

		if (!userId || !indexDate || !indexValue || indexValue < 0) {
			return res.status(400).json({ error: "Invalid or missing fields in the request body" })
		}

		const existingUser = await User.findOne({ where: { id: userId } })
		if (!existingUser) {
			return res.status(404).json({ error: "User not found" })
		}

		// Check for previous entries
		let earlierRecord: Index | null = await Index.findOne({
			where: {
				userId,
				indexDate: {
					[Op.lt]: indexDate,
				},
			},
			order: [["indexDate", "DESC"]],
			attributes: ["indexValue", "indexDate"],
		})

		if (!earlierRecord) {
			// If no records are found before the current index date, attempt to find the earliest index date after the current index date
			earlierRecord = await Index.findOne({
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

		if (!earlierRecord) {
			// If this is the first index record, consumption can/will not be recorded and calculated.
			await Index.create({ userId, indexDate, indexValue })
			return res.status(201).json({ message: "Index added successfully." })
		}

		// Calculate consumption and create records for each day in between
		const consumptionValue = Math.abs(indexValue - earlierRecord.indexValue)
		const startDate = earlierRecord.indexDate < indexDate ? earlierRecord.indexDate : indexDate
		const endDate = earlierRecord.indexDate < indexDate ? indexDate : earlierRecord.indexDate
		const consumptionDates = getDatesInRange(startDate, endDate)

		// Insert index record
		await Index.create({ userId, indexDate, indexValue })

		// Insert consumption records
		if (consumptionValue > 0 && consumptionDates.length > 0) {
			const consumptionPerDay = consumptionValue / consumptionDates.length
			for (const date of consumptionDates) {
				await Consumption.create({
					userId,
					consumptionDate: date,
					consumptionValue: consumptionPerDay,
				})
			}
		}

		return res.status(201).json({ message: "Index and consumption added successfully." })
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

	while (currentDate < end) {
		dates.push(new Date(currentDate))
		currentDate.setDate(currentDate.getDate() + 1)
	}

	return dates
}
