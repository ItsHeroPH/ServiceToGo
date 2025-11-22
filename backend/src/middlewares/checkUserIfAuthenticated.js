/**
 * @param { { 
 * success:
 *  { status: Number, message: String },
 * error: 
 *  { status: Number, message: String } 
 * } } configuration
 * @returns {import("express").RequestHandler}
 */
export default function checkUserIfAuthenticated(configuration) {
    return (req, res, next) => {
        if(req.isAuthenticated()) {
            if(configuration.success && configuration.success.status !== 200) return res.json(configuration.success);
            return next();
        } else {
            if(configuration.error && configuration.error.status !== 200) return res.json(configuration.error);
            return next();
        }
    }
}