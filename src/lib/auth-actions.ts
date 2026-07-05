"use server";

import { prisma } from "@/lib/prisma";
import { scryptSync, randomBytes } from "crypto";

export async function signUp(formData: FormData) {
    const username = (formData.get("username") as string)?.trim().toLowerCase();
    const password = formData.get("password") as string;
    const displayName = formData.get("name") as string;

    if (!username || !password) {
        return { error: "Tên nhân vật và mật khẩu là bắt buộc" };
    }

    if (username.length < 3 || username.length > 16) {
        return { error: "Tên nhân vật phải từ 3 đến 16 ký tự" };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { error: "Tên nhân vật chỉ được chứa chữ cái, số và dấu gạch dưới (_)" };
    }

    if (password.length < 6) {
        return { error: "Mật khẩu phải có ít nhất 6 ký tự" };
    }

    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");
    const hashedPassword = `${salt}:${hash}`;

    try {
        const user = await prisma.user.create({
            data: {
                username,
                name: displayName || username,
                password: hashedPassword,
            },
        });
        return { success: true };
    } catch (error: unknown) {
        console.error("signUp error:", error);
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return { error: "Tên nhân vật này đã được đăng ký rồi!" };
        }
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2003') {
            return { error: "Lỗi cơ sở dữ liệu: Hãy chạy 'npx prisma db push' trước" };
        }
        const msg = error instanceof Error ? error.message : String(error);
        return { error: `Lỗi: ${msg}` };
    }
}
