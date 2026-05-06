-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "parentFormId" TEXT,
ADD COLUMN     "schemaVersion" TEXT NOT NULL DEFAULT '1.0';

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_parentFormId_fkey" FOREIGN KEY ("parentFormId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;
