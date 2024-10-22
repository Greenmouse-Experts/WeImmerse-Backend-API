import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Model } from 'sequelize';

// Load environment variables from .env file
dotenv.config();

// Define a type for models
type ModelInstance = typeof Model & {
  associate?(models: Record<string, ModelInstance>): void;
  init(sequelize: Sequelize): void;
};

// Define the service
const sequelizeService = {
  connection: null as Sequelize | null,
  models: {} as Record<string, ModelInstance>,

  init: async () => {
    try {
      // Create the connection
      sequelizeService.connection = new Sequelize(
        process.env.DB_NAME!,
        process.env.DB_USER!,
        process.env.DB_PASS!,
        {
          host: process.env.DB_HOST!,
          dialect: process.env.DB_DIALECT as any,
          logging: false,
          define: {
            timestamps: true,
          },
        }
      );

      // Test connection
      await sequelizeService.connection.authenticate();
      console.log("Database connected successfully");

      // Load models dynamically
      const modelDirectory = path.join(__dirname, '../models');
      const modelFiles = fs.readdirSync(modelDirectory).filter(file => file.endsWith('.ts'));

      // Import and initialize models
      for (const file of modelFiles) {
        const modelModule = await import(path.join(modelDirectory, file));
        const model = modelModule.default; // Ensure the model is exported as default
        
        if (typeof model.init === 'function') {
          // Pass the sequelize instance to the init function
          modelModule.initUserModel(sequelizeService.connection); 
          sequelizeService.models[model.name] = model; // Store the model in the models object
          console.log(`Model ${model.name} initialized`);
        } else {
          console.error(`Model init function is missing for ${file}`);
        }
      }

      // Set up associations
      for (const modelName in sequelizeService.models) {
        const model = sequelizeService.models[modelName];
        if (model.associate) {
          model.associate(sequelizeService.models);
        }
      }

      // Sync the models with the database
      await sequelizeService.connection.sync({ force: false });
      console.log('[SEQUELIZE] Database service initialized');
    } catch (error) {
      console.error('[SEQUELIZE] Error during database service initialization', error);
      throw error;
    }
  },
};

// Export the sequelize service
export default sequelizeService;
