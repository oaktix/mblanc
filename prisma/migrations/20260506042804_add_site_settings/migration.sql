-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "siteName" TEXT NOT NULL DEFAULT 'MBlanc Bespoke',
    "headerLogo" TEXT,
    "footerLogo" TEXT,
    "contactEmail" TEXT NOT NULL DEFAULT 'hello@mblancfits.com',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
