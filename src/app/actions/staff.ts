"use server";

import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createStaffAccount(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string; // STAFF or ADMIN

  const hashedPassword = await hash(password, 12);

  try {
    await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role as any,
      },
    });
  } catch (error) {
    console.error("Error creating staff account:", error);
    return { error: "Email already exists or internal error" };
  }

  revalidatePath("/admin/staff");
  redirect("/admin/staff");
}
