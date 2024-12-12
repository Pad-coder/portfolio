import { Router } from "express";
import sendMesssage from "../controller/sendmessage.js";

const Routes = Router()

Routes.use('/sendMesssage',sendMesssage)

export default Routes