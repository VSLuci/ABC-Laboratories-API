import { verify } from "jsonwebtoken";
import { ApiError } from "../util/api";
import logger from "../logger";
import User from "../model/user";
import { isEmpty } from "lodash";
import { UnauthorizedException } from "../util/error";
const secret = process.env.JWT_SECRET;

export const jwt = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        const tokenData = verify(token, secret)

        const user = await User.findOne({email: tokenData.email});

        if (isEmpty(user)) throw new UnauthorizedException('User not found');

        if (!user.tokens.find(elmnt => elmnt === token)) throw new UnauthorizedException('Logged out token');

        req.user = tokenData;

        next();
    } catch (error) {
        logger.warn(`Token validation failure | ${error.message}`)
        return res.status(401).send(new ApiError('Unauthorized!'))
    }
}