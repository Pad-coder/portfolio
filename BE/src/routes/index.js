import { Router } from "express";
import sendMesssage from "../controller/sendmessage.js";

const Routes = Router()

Routes.post('/sendMesssage',sendMesssage)

export default Routes