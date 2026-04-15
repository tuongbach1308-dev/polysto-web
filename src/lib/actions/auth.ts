"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface AuthResult {
  error?: string;
  success?: boolean;
}

/** Customer sign up with email + password */
export async function signUp(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;

  if (!email || !password) {
    return { error: "Email và mật khẩu là bắt buộc" };
  }

  if (password.length < 6) {
    return { error: "Mật khẩu phải có ít nhất 6 ký tự" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || "",
        phone: phone || "",
      },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Email này đã được đăng ký" };
    }
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

/** Sign in with email + password */
export async function signIn(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Vui lòng nhập email và mật khẩu" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Email hoặc mật khẩu không đúng" };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

/** Sign out */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/** Reset password — send reset email */
export async function resetPassword(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  if (!email) {
    return { error: "Vui lòng nhập email" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/tai-khoan/thong-tin`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

/** Update user profile */
export async function updateProfile(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Chưa đăng nhập" };

  const fullName = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone || null,
    })
    .eq("id", user.id);

  if (error) {
    if (error.message.includes("duplicate key") || error.message.includes("unique")) {
      return { error: "Số điện thoại này đã được sử dụng" };
    }
    return { error: error.message };
  }

  revalidatePath("/tai-khoan");
  return { success: true };
}

/** Change password */
export async function changePassword(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const newPassword = formData.get("new_password") as string;
  if (!newPassword || newPassword.length < 6) {
    return { error: "Mật khẩu mới phải có ít nhất 6 ký tự" };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
