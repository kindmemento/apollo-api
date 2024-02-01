// src/index.ts
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import { sequelize } from './database';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use(routes);

// Start the server
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    // Sync database models with database
    try {
        await sequelize.sync({ force: false });
        console.log('Database synced successfully');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
});
