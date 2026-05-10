// Note routes — all protected
import { Router } from "express";
import { getNotesHandler, addNoteHandler, updateNoteHandler, deleteNoteHandler } from "./note.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", getNotesHandler);
router.post("/", addNoteHandler);
router.patch("/:noteId", updateNoteHandler);
router.delete("/:noteId", deleteNoteHandler);

export default router;
