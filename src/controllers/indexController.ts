import { Request, Response } from 'express';
import { Index } from '../models/index';
import { Consumption } from "../models/consumption";

export const addIndex = async (req: Request, res: Response) => {
	try {
		const { userId, indexDate, indexValue } = req.body;

		// Validate input data
		if (!userId || !indexDate || !indexValue) {
			return res.status(400).json({ error: "Missing required fields" })
		}

		// Insert index value into Indexes table
		await Index.create({ userId, indexDate, indexValue });

		// @TODO: Calculate consumption
		const consumptionValue = 0; // Placeholder for now

		await Consumption.create({ userId, consumptionDate: indexDate, consumptionValue })

		return res.status(201).json({ message: "Index added successfully" })
	} catch (error) {
		console.error("Error adding index:", error);
		return res.status(500).json({ error: "Internal server error" })
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
