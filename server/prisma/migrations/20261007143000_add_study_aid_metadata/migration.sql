-- Persist the AI summary with each uploaded material.
ALTER TABLE "Material" ADD COLUMN "summary" TEXT;

-- Keep topic-wise flashcard importance metadata with each generated card.
ALTER TABLE "Flashcard" ADD COLUMN "topic" TEXT;
ALTER TABLE "Flashcard" ADD COLUMN "importance" TEXT;
ALTER TABLE "Flashcard" ADD COLUMN "importanceNote" TEXT;
