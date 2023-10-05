import express from 'express';
import controller from '../controllers/Author';
import { Schemas, ValiDateSchema } from '../middleware/ValiDateSchema';

const router = express.Router();

router.post('/create',ValiDateSchema(Schemas.author.create) ,controller.createAuthor);
router.get('/get/:authorId', controller.readAuthor);
router.get('/get', controller.readAll);
router.patch('/update/:authorId', ValiDateSchema(Schemas.author.update), controller.updateAuthor);
router.delete('/delete/:authorId', controller.deleteAuthor);

export = router;