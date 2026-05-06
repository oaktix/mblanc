"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSiteSettings(formData: FormData) {
  const siteName = formData.get("siteName") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const headerLogo = formData.get("headerLogo") as string;
  const footerLogo = formData.get("footerLogo") as string;

  try {
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        siteName,
        contactEmail,
        headerLogo,
        footerLogo,
      },
      create: {
        id: "singleton",
        siteName,
        contactEmail,
        headerLogo,
        footerLogo,
      },
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return { error: "Failed to update settings" };
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
    });
    return settings || {
      siteName: "MBlanc Bespoke",
      headerLogo: "/header-logo.png",
      footerLogo: "/footer-logo.png",
      contactEmail: "hello@mblancfits.com",
    };
  } catch (error) {
    return {
      siteName: "MBlanc Bespoke",
      headerLogo: "/header-logo.png",
      footerLogo: "/footer-logo.png",
      contactEmail: "hello@mblancfits.com",
    };
  }
}
