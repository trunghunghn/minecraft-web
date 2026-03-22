export interface ScriptTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    code: string;
    category: "Building" | "World" | "Fun";
}

export const SCRIPT_TEMPLATES: ScriptTemplate[] = [
    {
        id: "build-house",
        name: "Xây nhà gỗ thần tốc",
        description: "Tạo một ngôi nhà gỗ cơ bản tại vị trí hiện tại của bạn.",
        icon: "🏠",
        category: "Building",
        code: `// Tự động xây nhà gỗ
function buildHouse() {
    const p = player.location;
    // Móng nhà
    world.fill(p.x-2, p.y-1, p.z-2, p.x+2, p.y-1, p.z+2, "oak_planks");
    // Tường
    world.fill(p.x-2, p.y, p.z-2, p.x+2, p.y+3, p.z-2, "oak_log");
    world.fill(p.x-2, p.y, p.z+2, p.x+2, p.y+3, p.z+2, "oak_log");
    // ... thêm logic khác
    player.sendMessage("§aĐã xây xong nhà!");
}
buildHouse();`
    },
    {
        id: "midas-touch",
        name: "Bàn tay Midas",
        description: "Biến mọi khối bạn chạm vào thành Vàng.",
        icon: "✨",
        category: "Fun",
        code: `// Bàn tay Midas
events.on("block_break", (event) => {
    const block = event.block;
    world.setBlock(block.location, "gold_block");
    event.cancel = true; // Không cho phá block
});
player.sendMessage("§6Bàn tay Midas đã được kích hoạt!");`
    },
    {
        id: "super-jump",
        name: "Siêu nhảy",
        description: "Tăng khả năng nhảy cao cho người chơi.",
        icon: "🦘",
        category: "World",
        code: `// Siêu nhảy
player.addEffect("jump_boost", 99999, 5);
player.sendMessage("§bBạn đã có sức mạnh siêu nhảy!");`
    },
    {
        id: "clear-weather",
        name: "Trời quang mây tạnh",
        description: "Dừng mưa và chuyển thời gian sang ban ngày.",
        icon: "☀️",
        category: "World",
        code: `// Chỉnh thời tiết
world.setWeather("clear");
world.setTime(1000);
player.sendMessage("§eTrời đã nắng đẹp!");`
    }
];
