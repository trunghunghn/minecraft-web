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
        description: "Tạo một ngôi nhà gỗ hoàn chỉnh với cửa sổ và mái nhà tại vị trí của bạn.",
        icon: "🏠",
        category: "Building",
        code: `// Script Xây nhà gỗ hiện đại (v1.12.2)
function buildModernHouse() {
    const p = player.location;
    const x = Math.floor(p.x);
    const y = Math.floor(p.y);
    const z = Math.floor(p.z);
    
    // 1. Móng và sàn (7x7)
    world.fill(x-3, y-1, z-3, x+3, y-1, z+3, "cobblestone");
    world.fill(x-2, y-1, z-2, x+2, y-1, z+2, "planks");
    
    // 2. Cột trụ 4 góc (Gỗ log cao 4 tầng)
    world.fill(x-3, y, z-3, x-3, y+3, z-3, "log");
    world.fill(x+3, y, z-3, x+3, y+3, z-3, "log");
    world.fill(x-3, y, z+3, x-3, y+3, z+3, "log");
    world.fill(x+3, y, z+3, x+3, y+3, z+3, "log");
    
    // 3. Tường gỗ (Planks)
    world.fill(x-3, y, z-2, x-3, y+3, z+2, "planks"); // Trái
    world.fill(x+3, y, z-2, x+3, y+3, z+2, "planks"); // Phải
    world.fill(x-2, y, z-3, x+2, y+3, z-3, "planks"); // Sau
    world.fill(x-2, y, z+3, x+2, y+3, z+3, "planks"); // Trước
    
    // 4. Kính cửa sổ
    world.fill(x-3, y+1, z-1, x-3, y+2, z+1, "glass_pane"); // Cửa sổ trái
    world.fill(x+3, y+1, z-1, x+3, y+2, z+1, "glass_pane"); // Cửa sổ phải
    world.setBlock(x, y+2, z-3, "glass_pane"); // Cửa sổ sau
    
    // 5. Cửa ra vào (Mặt trước)
    world.setBlock(x, y, z+3, "air");
    world.setBlock(x, y+1, z+3, "air");
    
    // 6. Mái nhà (Sử dụng slab cho phẳng đẹp)
    world.fill(x-4, y+4, z-4, x+4, y+4, z+4, "wooden_slab");
    world.fill(x-3, y+4, z-3, x+3, y+4, z+3, "planks");
    
    // 7. Nội thất cơ bản (Đuốc + Giường + Crafting Table)
    world.setBlock(x-2, y+2, z-2, "torch");
    world.setBlock(x+2, y+2, z+2, "torch");
    world.setBlock(x-2, y, z-2, "crafting_table");
    
    player.sendMessage("§a[AI] Đã xây xong nhà gỗ hiện đại cho bạn! Chúc bạn chơi vui vẻ.");
}
buildModernHouse();`
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
