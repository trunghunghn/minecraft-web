import { redirect } from "next/navigation";

// Trang này redirect thẳng đến file game gốc để WebGL chạy đúng
export default function GamePage() {
    redirect("/game/1.12.2/index.html");
}
