"use server";

import { prisma } from "@/lib/prisma";
import { scryptSync, randomBytes } from "crypto";
import { signIn } from "@/auth";

export async function signUp(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password) {
        return { error: "Email và mật khẩu là bắt buộc" };
    }

    // Tạo salt và hash mật khẩu bằng crypto có sẵn
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");
    const hashedPassword = `${salt}:${hash}`;

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        return { success: true };
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { error: "Email này đã được đăng ký" };
        }
        return { error: "Có lỗi xảy ra khi tạo tài khoản" };
    }
}
