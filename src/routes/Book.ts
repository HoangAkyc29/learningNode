import express from 'express';
import controller from '../controllers/Book';
import { Schemas, ValiDateSchema } from '../middleware/ValiDateSchema';

const router = express.Router();

router.post('/create', ValiDateSchema(Schemas.book.create), controller.createBook);
router.get('/get/:bookId', controller.readBook);
router.get('/get', controller.readAll);
router.patch('/update/:bookId', ValiDateSchema(Schemas.book.update), controller.updateBook);
router.delete('/delete/:bookId', controller.deleteBook);

export = router;