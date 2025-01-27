import { Request, Response } from 'express';
import Information, { IInformation } from '../models/Information';
import nodemailer from 'nodemailer';

export const addInformation = async (req: Request, res: Response) => {
    try {
        const { id, name, position, organization, country, email, phoneNo } = req.body;

        // Check if the id already exists
        const existingInfo = await Information.findOne({ id });
        if (existingInfo) {
            res.status(400).json({ message: 'Entry with this ID already exists' });
        }else{
            const newInfo: IInformation = new Information({
                id,
                name,
                position,
                organization,
                country,
                email,
                phoneNo,
            });

            await newInfo.save();

            // Send email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Thank You!',
                text: `Thank you, ${name}, for providing your information.`
            });

            res.status(201).json({ message: 'Data saved and email sent successfully' });
        }
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getInformation = async (req: Request, res: Response) => {
    try {
        // Extracting query parameters for pagination
        const page = parseInt(req.query.page as string) || 1; // Default to page 1
        const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit; // Calculate the number of documents to skip

        // Aggregation pipeline to ensure unique `id` and get the latest document per `id`
        const data = await Information.aggregate([
            { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order (latest first)
            {
                $group: {
                    _id: "$id", // Group by `id`
                    name: { $first: "$name" },
                    position: { $first: "$position" },
                    organization: { $first: "$organization" },
                    country: { $first: "$country" },
                    email: { $first: "$email" },
                    phoneNo: { $first: "$phoneNo" },
                    createdAt: { $first: "$createdAt" }, // Get the latest `createdAt` for each unique `id`
                },
            },
            { $skip: skip }, // Pagination: Skip documents based on the page
            { $limit: limit }, // Pagination: Limit the number of documents per page
        ]);

        // Fetch the total count of unique `id`s for pagination
        const totalDocuments = await Information.aggregate([
            { $group: { _id: "$id" } }, // Group by `id` to count unique `id`s
        ]);
        const totalPages = Math.ceil(totalDocuments.length / limit);

        // Respond with paginated data and metadata
        res.status(200).json({
            data,
            currentPage: page,
            totalPages,
            totalDocuments: totalDocuments.length,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};