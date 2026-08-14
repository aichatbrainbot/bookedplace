-- AlterTable
ALTER TABLE `blogpost` ADD COLUMN `category` ENUM('GENERAL', 'TRAVEL', 'STAYS', 'FOOD', 'ACTIVITIES', 'TIPS', 'NEWS') NOT NULL DEFAULT 'GENERAL';

-- CreateIndex
CREATE INDEX `BlogPost_category_idx` ON `BlogPost`(`category`);
