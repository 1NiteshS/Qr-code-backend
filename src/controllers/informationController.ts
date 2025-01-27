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

        // Fetch paginated data
        const data = await Information.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Fetch the total count of documents for calculating total pages
        const totalDocuments = await Information.countDocuments();
        const totalPages = Math.ceil(totalDocuments / limit);

        // Respond with paginated data and metadata
        res.status(200).json({
            data,
            currentPage: page,
            totalPages,
            totalDocuments,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
