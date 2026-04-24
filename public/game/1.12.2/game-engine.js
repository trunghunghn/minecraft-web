(function() {
    console.log("%c[LAN-Fix] Đang kích hoạt bản vá LAN ULTIMATE...", "color: #ff0000; font-weight: bold; font-size: 14px;");

    // 1. Ghi đè cấu hình toàn cục
    function forceOptions() {
        if (!window.eaglercraftXOpts) window.eaglercraftXOpts = {};
        
        const opts = window.eaglercraftXOpts;
        opts.allowLAN = true;
        opts.allowServerConfig = true;
        opts.checkRelays = true;
        opts.enableMultiplayer = true;
        opts.integratedServer = true;
        opts.forceIntegratedServer = true;

        // Cập nhật Relay
        opts.relays = [
            { addr: "wss://relay.webmc.fun/", name: "WebMC Relay (Stable)" },
            { addr: "wss://relay.de0.cc/", name: "Official Relay #1" },
            { addr: "wss://relay.lax1dude.net/", name: "Lax1dude Relay #2" },
            { addr: "wss://relay.deev.is/", name: "Deev.is Relay" }
        ];
    }

    // 2. Ép buộc vào LocalStorage (Nơi Eaglercraft lưu cài đặt)
    function patchLocalStorage() {
        try {
            let settings = localStorage.getItem("eaglercraftX.settings");
            if (settings) {
                let data = JSON.parse(settings);
                data.allowLAN = true;
                data.enableMultiplayer = true;
                localStorage.setItem("eaglercraftX.settings", JSON.stringify(data));
                console.log("[LAN-Fix] Đã vá LocalStorage Settings.");
            }
        } catch(e) {
            console.error("[LAN-Fix] Không thể vá LocalStorage:", e);
        }
    }

    // 3. Thực thi liên tục
    forceOptions();
    patchLocalStorage();

    window.addEventListener('message', function(event) {
        if (event.data === 'FORCE_LAN_PATCH') {
            forceOptions();
            patchLocalStorage();
            console.log("[LAN-Fix] Đã nhận lệnh vá cưỡng bức từ UI.");
            
            // Thông báo cho người dùng
            if (window.alert) {
                alert("Đã VÁ LỖI LAN (ULTIMATE)!\n\n1. Hãy vào Singleplayer.\n2. Nhấn ESC.\n3. Nếu 'Open to LAN' vẫn xám, hãy đợi 5 giây rồi thử lại.\n4. Đảm bảo bạn đã chọn một Relay trong danh sách.");
            }
        }
    });

    // Loop check
    let i = 0;
    const l = setInterval(() => {
        forceOptions();
        if (i++ > 50) clearInterval(l);
    }, 200);

})();