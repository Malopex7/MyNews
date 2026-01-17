import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { connectDatabase } from './config/database';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares';

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({ origin: config.cors.origin }));

// Body parsing (increased limit for video uploads)
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ extended: true, limit: '150mb' }));

// Logging
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        await connectDatabase();

        app.listen(config.port, () => {
            console.log(`🚀 Server running on port ${config.port}`);
            console.log(`📝 Environment: ${config.nodeEnv}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;
