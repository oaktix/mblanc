import { Resend } from 'resend';

// This ensures the build doesn't crash if the key is missing during compilation
const apiKey = process.env.RESEND_API_KEY || "re_dummy_key_for_build";

export const resend = new Resend(apiKey);