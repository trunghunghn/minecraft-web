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

    window.isLanPatchApplied = false;

    window.addEventListener('message', function(event) {
        if (event.data === 'FORCE_LAN_PATCH') {
            if (applyPatch()) {
                window.isLanPatchApplied = true;
                console.log("%c[LAN-Fix] PATCH SUCCESSFUL!", "color: white; background: green; padding: 2px 5px; border-radius: 3px;");
            }
        }
    });

    // Xuất hàm ra global
    window.applyEaglercraftLanPatch = function() {
        if (applyPatch()) {
            window.isLanPatchApplied = true;
            return true;
        }
        return false;
    };

    console.log("%c[LAN-Fix] Script nạp thành công. Chờ kích hoạt...", "color: #3498db; font-weight: bold;");
})();