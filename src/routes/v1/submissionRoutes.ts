import express from "express";
import { addSubmission } from "../../controllers/submissionController";
import { validate } from "../../validators/zodValidators";
import { createSubmissionZodSchema } from "../../dtos/CreateSubmissionDto";

const submissionRouter = express.Router();

submissionRouter.use("/", validate(createSubmissionZodSchema), addSubmission);

export default submissionRouter;
