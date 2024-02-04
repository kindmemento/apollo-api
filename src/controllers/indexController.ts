import { Request, Response } from 'express';
import { Index } from '../models/index';
import { Consumption } from "../models/consumption";
import { Op } from "sequelize";

export const addIndex = async (req: Request, res: Response) => {
	try {
			const userId = req.userId || req.body.userId // Attempt to extract userId from request headers first, fallback to request body as a failsafe
			const { indexDate, indexValue } = req.body;

			if (!userId || !indexDate || !indexValue || indexValue < 0) {
					return res.status(400).json({ error: "Invalid or missing fields in the request body" });
			}

			await Index.create({ userId, indexDate, indexValue });

			// Check for previous entries
			const previousIndex = await Index.findOne({
					where: {
							userId,
							indexDate: {
									[Op.lt]: indexDate // Find the latest index before the current date
							}
					},
					order: [['indexDate', 'DESC']], // Order by indexDate in descending order to get the latest
					attributes: ['indexValue'] // Only fetch indexValue
			});

			if (!previousIndex) {
				// If this is the first index record, consumption can/will not be recorded and calculated.
				return res.status(201).json({ message: "Index added successfully." })
			}

			const consumptionValue = indexValue - previousIndex.indexValue;
			await Consumption.create({ userId, consumptionDate: indexDate, consumptionValue });

			return res.status(201).json({ message: "Index and consumption added successfully" });
	} catch (error) {
			console.error("Error adding index:", error);
			return res.status(500).json({ error: "Internal server error" });
	}
}

export const deleteIndex = async (req: Request, res: Response) => {
	try {
		const { indexId } = req.params;

		// Find index by ID
		const index = await Index.findByPk(indexId);

		if (!index) {
			return res.status(404).json({ error: "Index not found" });
		}

		// Delete index
		await index.destroy()

		return res.status(200).json({ message: "Index deleted successfully" });
	} catch (error) {
		console.error("Error deleting index:", error);
		return res.status(500).json({ error: "Internal server error" })
	}
}
