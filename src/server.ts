import express, { request } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Loggging from './library/Logging';
import authorRoutes from './routes/Author';
import bookRoutes from './routes/Book';

const router = express();

// connect mongoose 
mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority'})
.then(() => {
    console.log('connected');
    Loggging.info("Connected to MongoDB");
    StartServer();
})
.catch(err => { 
    console.error(err); 
    Loggging.error("Failed to connect to MongoDB");
    Loggging.error(err);
});

//Only Start the server if Mongo connects 
const StartServer = () => {
    router.use((req, res, next) => {
        Loggging.info(`Incoming -> Method: [${req.method} - Url: ${req.socket.remoteAddress} ]`)
        res.on('finish', () => {
            Loggging.info(`Incoming -> Method: [${req.method} - Url: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });
        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    //Rules of our API
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        if(req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    // Routes 
    router.use('/authors', authorRoutes);
    router.use('/books', bookRoutes);

    // Health check
    router.get('/ping', (req, res, next) => res.status(200).json({ message : 'pong'}));
    
    // Error handling
    router.use((req, res, next) => {
        const error = new Error('not found');
        Loggging.error(error);

        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () => Loggging.info(`Server listening on ${config.server.port}.`));

};