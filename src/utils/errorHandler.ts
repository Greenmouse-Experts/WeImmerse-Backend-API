import { Response } from 'express';
import { NotFoundError } from '../errors';

export function handleError(res: Response, error: unknown) {
  if (error instanceof NotFoundError) {
    return res.status(404).json({ message: error.message });
  }

  if (error instanceof Error) {
    return res.status(400).json({ message: error.message });
  }

  return res.status(500).json({ message: 'Internal server error' });
}
