(function() {
    console.log("%c[LAN-Fix] Đang kích hoạt bản vá LAN V3 (Stable)...", "color: #00ff00; font-weight: bold;");

    function applyPatch() {
        if (window.eaglercraftXOpts) {
            window.eaglercraftXOpts.allowLAN = true;
            window.eaglercraftXOpts.allowServerConfig = true;
            window.eaglercraftXOpts.checkRelays = true;
            window.eaglercraftXOpts.enableMultiplayer = true;
            window.eaglercraftXOpts.integratedServer = true;
            window.eaglercraftXOpts.forceIntegratedServer = true;

            if (!window.eaglercraftXOpts.relays) window.eaglercraftXOpts.relays = [];
            
            const stableRelays = [
                { addr: "wss://relay.webmc.fun/", name: "WebMC Relay (Stable)" },
                { addr: "wss://relay.de0.cc/", name: "Official Relay #1" },
                { addr: "wss://relay.lax1dude.net/", name: "Lax1dude Relay #2" },
                { addr: "wss://relay.deev.is/", name: "Deev.is Relay" }
            ];

            stableRelays.forEach(r => {
                const exists = window.eaglercraftXOpts.relays.some(existing => existing.addr === r.addr);
                if (!exists) window.eaglercraftXOpts.relays.unshift(r);
            });

            // Patch LocalStorage
            try {
                let settings = localStorage.getItem("eaglercraftX.settings");
                if (settings) {
                    let data = JSON.parse(settings);
                    data.allowLAN = true;
                    data.enableMultiplayer = true;
                    localStorage.setItem("eaglercraftX.settings", JSON.stringify(data));
                }
            } catch(e) {}

            return true;
        }
        return false;
    }

    // Lắng nghe sự kiện
    window.addEventListener('message', function(event) {
        if (event.data === 'FORCE_LAN_PATCH') {
            applyPatch();
            console.log("[LAN-Fix] Đã thực thi bản vá theo lệnh từ UI.");
            // Thông báo nhẹ nhàng qua console để tránh block engine
            console.log("%c[LAN-Fix] PATCH SUCCESSFUL!", "color: white; background: green; padding: 2px 5px; border-radius: 3px;");
        }
    });

    // Chạy một lần duy nhất khi vừa nạp
    applyPatch();

})();