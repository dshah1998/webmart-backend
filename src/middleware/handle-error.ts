import { RequestHandler } from 'express';

const slientAPIs = ['/auth/signin'];

/**
 * This router wrapper catches any error from async await
 * and throws it to the default express error handler,
 * instead of crashing the app
 *
 * @param handler Request handler to check for error
 */
export const handleError = (handler: RequestHandler): RequestHandler => async (req, res, next) => {
  try {
    /**
     * Note:
     * "@types/express": "^4.17.10"
     *
     * After version 4.7.10 of @types/express RequestHandler
     * returns void and can not chain catch method. So to make
     * function throw error in async manaer we are awaiting function
     */
    await handler(req, res, next);
  } catch (err) {
    const { originalUrl, user } = req;
    if (!slientAPIs.includes(originalUrl)) {
      let userToLog = {};
      if (user) {
        const { id, email } = user;
        userToLog = { id, email };
      }
    }
    next(err);
  }
};
