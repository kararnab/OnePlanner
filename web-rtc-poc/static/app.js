(async () => {
    const LK = window.LivekitClient;
    if (!LK) {
        console.error("LivekitClient global missing");
        return;
    }

    const { Room, createLocalTracks } = LK;

    const logEl = document.getElementById('log');
    const stage = document.getElementById('stage');

    function log(...args) {
        const line = '[' + new Date().toLocaleTimeString() + '] ' + args.join(' ');
        console.log(...args);
        logEl.innerText = line + '\n' + logEl.innerText;
    }

    let room = null;
    let localTracks = [];

    function attachTrackToTile(track, identity) {
        const el = document.createElement('div');
        el.className = 'participant';
        const video = track.attach();
        const wrapper = document.createElement('div');
        wrapper.appendChild(video);

        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.innerHTML = `<span>${identity}</span><span class="small">live</span>`;

        el.appendChild(wrapper);
        el.appendChild(meta);
        stage.appendChild(el);
    }

    function clearStage() { stage.innerHTML = ""; }

    async function getLivekitTokenViaWS(roomName, identity) {
        return new Promise((resolve, reject) => {
            const proto = (location.protocol === 'https:') ? 'wss:' : 'ws:';
            const url = `${proto}//${location.host}/ws?room=${encodeURIComponent(roomName)}&identity=${encodeURIComponent(identity)}`;
            const ws = new WebSocket(url);

            const timeout = setTimeout(() => {
                reject(new Error("token timeout"));
                ws.close();
            }, 15000);

            ws.onmessage = ev => {
                try {
                    const msg = JSON.parse(ev.data);
                    if (msg.type === "livekit_token") {
                        const payload = typeof msg.payload === "string" ? JSON.parse(msg.payload) : msg.payload;
                        clearTimeout(timeout);
                        ws.close();
                        resolve(payload);
                    }
                } catch (_) {}
            };
        });
    }

    async function join(roomName, identity) {
        try {
            const payload = await getLivekitTokenViaWS(roomName, identity);
            const { url, token, iceServers } = payload; //url is liveKitUrl

            const room = new Room({
                adaptiveStream: true,
                dynacast: true,
            });

            await room.connect(url, token, {
                autoSubscribe: true,
                rtcConfig: {
                    iceServers: iceServers,
                    iceTransportPolicy: "relay" // all / relay
                }
            });

            log("connected to LiveKit");

            room.remoteParticipants.forEach(p => {
                p.trackPublications.forEach(pub => {
                    if (pub.isSubscribed && pub.track) {
                        attachTrackToTile(pub.track, p.identity);
                    }
                });
                p.on("trackSubscribed", (track, pub) => {
                    attachTrackToTile(track, p.identity);
                });
            });

            room.on("participantConnected", p => {
                p.on("trackSubscribed", t => attachTrackToTile(t, p.identity));
            });

            // Detect available devices first
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasAudio = devices.some(d => d.kind === "audioinput");
            const hasVideo = devices.some(d => d.kind === "videoinput");

            let trackOptions = {};
            if (hasAudio) trackOptions.audio = true;
            if (hasVideo) trackOptions.video = true;

            try {
                if (hasAudio || hasVideo) {
                    localTracks = await createLocalTracks(trackOptions);
                } else {
                    log("No audio/video devices available — joining in view-only mode.");
                }
            } catch (err) {
                log("Local track error:", err);
            }

            for (const t of localTracks) {
                await room.localParticipant.publishTrack(t);
                if (t.kind === "video") attachTrackToTile(t, identity);
            }

        } catch (e) {
            log("join error", e);
        }
    }

    async function leave() {
        if (room) {
            room.disconnect();
            room = null;
        }
        localTracks.forEach(t => t.stop());
        clearStage();
        log("left room");
    }

    document.getElementById("joinBtn").onclick = async () => {
        const r = document.getElementById("roomInput").value;
        const id = document.getElementById("identityInput").value || "guest";
        await join(r, id);
    };

    document.getElementById("leaveBtn").onclick = leave;

})();
