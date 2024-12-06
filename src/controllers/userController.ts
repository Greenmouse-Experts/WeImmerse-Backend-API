// src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { v4 as uuidv4 } from "uuid";
import { Op, ForeignKeyConstraintError } from "sequelize";
import { sendMail } from "../services/mail.service";
import { emailTemplates } from "../utils/messages";
import logger from "../middlewares/logger"; // Adjust the path to your logger.js
import { AuthenticatedRequest } from "../types/index";
import { } from "../utils/helpers";
import https from 'https';

