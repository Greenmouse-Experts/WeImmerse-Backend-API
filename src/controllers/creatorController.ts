// src/controllers/creatorController.ts
import { Request, Response, NextFunction } from "express";
import { sendMail } from "../services/mail.service";
import { emailTemplates } from "../utils/messages";
import JwtService from "../services/jwt.service";
import logger from "../middlewares/logger"; 
import { Op, ForeignKeyConstraintError, Sequelize } from "sequelize";

