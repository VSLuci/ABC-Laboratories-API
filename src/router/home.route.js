import { Router } from "express";
const router = Router();

router.post('/', (req, res) => res.send(`Hello ${req.user.name}`))

export default router;