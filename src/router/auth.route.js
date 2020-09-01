import { Router } from "express";
import { register, login } from "../controller/auth.controller";

const router = Router();

const auth_url = enpoint => `/${enpoint}`;

router.post(auth_url('register'), register)
router.post(auth_url('login'), login)

export default router;