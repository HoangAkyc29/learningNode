import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from "express";
import Loggging from '../library/Logging';
import { IAuthor } from '../models/Author';
import { IBook } from '../models/Book';

export const ValiDateSchema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validate(req.body);

            next();
        }
        catch (err) {
            Loggging.error(err);
            return res.status(422).json({err});
        }
    };
};

export const Schemas = {
    author: {
        create: Joi.object<IAuthor>({
            name: Joi.string().required()
        }),
        update: Joi.object<IAuthor>({
            name: Joi.string().required()
        })
    },
    book: {
        create: Joi.object<IBook>({
            author: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            title: Joi.string().required()
        }),
        update: Joi.object<IBook>({
            author: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            title: Joi.string().required()
        })
    }
}