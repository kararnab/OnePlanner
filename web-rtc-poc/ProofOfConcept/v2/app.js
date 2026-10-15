const localServerIp = "192.168.29.234"; // Replace with your actual local IP

const fallbackIceServers = [
    { urls: `stun:${localServerIp}:3478` },
    { urls: "stun:stun.l.google.com:19302" }
];

let roomName = "";
let localStream = null;
const peers = new Map(); // peerId => RTCPeerConnection
const streams = new Map(); // peerId => MediaStream (remote)

let ws = null;
let peerId = null;

let isAudioEnabled = false;
let isVideoEnabled = true;

let streamReady = false;

const landingPage = document.getElementById("landingPage");
const previewPage = document.getElementById("previewPage");
const callPage = document.getElementById("callPage");
const roomInput = document.getElementById("roomInput");
const previewVideo = document.getElementById("previewVideo");
const previewRoomLabel = document.getElementById("previewRoomLabel");
const callRoomLabel = document.getElementById("callRoomLabel");
const participantCount = document.getElementById("participantCount");
const videoGrid = document.getElementById("videoGrid");
const statusDiv = document.getElementById("status");

// Read room from URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("room")) {
    roomName = urlParams.get("room");
    showPreview();
}

function setStatus(text) {
    if (statusDiv) statusDiv.textContent = text;
}

function goToPreview() {
    const btn = event?.target;
    if (btn) btn.disabled = true;

    roomName = roomInput.value.trim();
    if (!roomName) {
        if (btn) btn.disabled = false;
        return;
    }

    window.location.href = `?room=${roomName}`;
}

async function getMediaStreamWithFallback() {
    const tryConfigs = [
        { audio: true, video: { width: { ideal: 1280 }, height: { ideal: 720 } } },
        { audio: false, video: { width: { ideal: 1280 }, height: { ideal: 720 } } },
        { audio: true, video: false }
    ];

    for (const config of tryConfigs) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(config);
            return {
                stream,
                gotAudio: stream.getAudioTracks().length > 0,
                gotVideo: stream.getVideoTracks().length > 0
            };
        } catch (err) {
            console.warn(`getUserMedia failed with config ${JSON.stringify(config)}:`, err.message);
        }
    }

    return { stream: null, gotAudio: false, gotVideo: false };
}

async function showPreview() {
    landingPage.classList.remove("active");
    previewPage.classList.add("active");
    previewRoomLabel.innerText = `Room: ${roomName}`;

    const { stream, gotAudio, gotVideo } = await getMediaStreamWithFallback();

    isAudioEnabled = gotAudio;
    isVideoEnabled = gotVideo;

    if (stream) {
        localStream = stream;
        previewVideo.srcObject = stream;
        previewVideo.poster = "";
    } else {
        localStream = null;
        previewVideo.srcObject = null;
        previewVideo.poster = "/placeholder.jpg";
        console.warn("No camera detected → showing placeholder.");
    }

    updateControlButton("audio", gotAudio);
    updateControlButton("video", gotVideo);
}


function toggleAudio() {
    if (!localStream) {
        updateControlButton("audio", false);
        return;
    }

    const audioTracks = localStream.getAudioTracks();
    if (audioTracks.length === 0) return;

    // Toggle track
    audioTracks.forEach(track => (track.enabled = !track.enabled));
    isAudioEnabled = audioTracks[0].enabled;

    updateControlButton("audio", isAudioEnabled);

    // 🔥 Notify peers
    for (const pc of peers.values()) {
        pc.getSenders().forEach(sender => {
            if (sender.kind === "audio") {
                sender.replaceTrack(isAudioEnabled ? audioTracks[0] : null)
                    .catch(err => console.warn("replaceTrack(audio) error", err));
            }
        });
    }
}

function toggleVideo() {
    if (!localStream) {
        updateControlButton("video", false);
        return;
    }

    const videoTracks = localStream.getVideoTracks();
    if (videoTracks.length === 0) return;

    videoTracks.forEach(track => (track.enabled = !track.enabled));
    isVideoEnabled = videoTracks[0].enabled;

    updateControlButton("video", isVideoEnabled);

    // 🔥 Notify peers
    for (const pc of peers.values()) {
        pc.getSenders().forEach(sender => {
            if (sender.kind === "video") {
                sender.replaceTrack(isVideoEnabled ? videoTracks[0] : null)
                    .catch(err => console.warn("replaceTrack(video) error", err));
            }
        });
    }

    // When disabling video → show placeholder
    const localTile = document.getElementById("video-local");
    if (localTile) {
        localTile.querySelector("video").style.display = isVideoEnabled ? "block" : "none";
        let indicator = localTile.querySelector(".video-off-indicator");

        if (!isVideoEnabled) {
            if (!indicator) {
                indicator = document.createElement("div");
                indicator.className = "video-off-indicator";
                indicator.innerHTML = `<i class="fas fa-video-slash"></i>`;
                localTile.appendChild(indicator);
            }
        } else if (indicator) {
            indicator.remove();
        }
    }
}

function updateControlButton(type, isEnabled) {
    const pagePrefix = previewPage.classList.contains("active") ? "preview-" : "";
    const btnId = `${pagePrefix}${type}-btn`.toLowerCase();
    const btn = document.getElementById(btnId);
    const icon = btn.querySelector("i");
    if (!icon) return;

    if (type === "audio") {
        icon.className = isEnabled ? "fas fa-microphone" : "fas fa-microphone-slash";
    } else {
        icon.className = isEnabled ? "fas fa-video" : "fas fa-video-slash";
    }

    btn.setAttribute("aria-pressed", String(isEnabled));
    btn.setAttribute("aria-label", `${type} ${isEnabled ? "on" : "off"}`);
}

async function joinRoom() {
    const joinBtn = document.querySelector('.join-button');
    joinBtn.disabled = true;
    joinBtn.textContent = 'Joining...';

    previewPage.classList.remove('active');
    callPage.classList.add('active');
    callRoomLabel.innerText = `Room: ${roomName}`;
    participantCount.innerText = 'Connecting...';

    addVideoTile('local', localStream, 'You');

    updateControlButton('audio', isAudioEnabled);
    updateControlButton('video', isVideoEnabled);

    const a = document.getElementById("remoteAudio");
    if (a) a.muted = false;  // unlock audio

    try {
        await startConnection();
    } catch (err) {
        setStatus('Failed to join call.');
        console.error(err);
    } finally {
        joinBtn.disabled = false;
        joinBtn.textContent = 'Join Now';
    }
}

// ----- Video tile management -----
function addVideoTile(id, stream, label) {
    // Remove old tile if it exists
    const existing = document.getElementById(`video-${id}`);
    if (existing) existing.remove();

    const tile = document.createElement("div");
    tile.className = "video-tile";
    tile.id = `video-${id}`;

    // -----------------------------
    // VIDEO ELEMENT (always created)
    // -----------------------------
    const video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.muted = (id === "local");   // needed for autoplay
    video.style.display = "none"; // initially hidden until stream comes

    // -----------------------------
    // PLACEHOLDER (user icon)
    // -----------------------------
    const placeholder = document.createElement("div");
    placeholder.className = "video-placeholder";
    placeholder.innerHTML = `<i class="fas fa-user"></i>`;
    placeholder.style.display = "flex";

    // -----------------------------
    // CAMERA OFF INDICATOR
    // -----------------------------
    const indicator = document.createElement("div");
    indicator.className = "video-off-indicator";
    indicator.innerHTML = `<i class="fas fa-video-slash"></i>`;
    // indicator only shown when there is no video stream
    indicator.style.display = stream ? "none" : "flex";

    // -----------------------------
    // NAME LABEL
    // -----------------------------
    const nameLabel = document.createElement("div");
    nameLabel.className = "name-label";
    nameLabel.textContent = label;

    // -----------------------------
    // ATTACH STREAM IF AVAILABLE
    // -----------------------------
    if (stream instanceof MediaStream) {
        video.srcObject = stream;
        video.style.display = "block";
        placeholder.style.display = "none";
        indicator.style.display = "none";

        setTimeout(() => {
            video.play().catch(err => {
                console.warn(`video.play failed for ${id}:`, err);
            });
        }, 50);
    }

    // -----------------------------
    // APPEND ELEMENTS
    // -----------------------------
    tile.appendChild(video);
    tile.appendChild(placeholder);
    tile.appendChild(indicator);
    tile.appendChild(nameLabel);

    videoGrid.appendChild(tile);
    updateParticipantCount();
}

function removePeer(id) {
    const pc = peers.get(id);
    pc?.close();

    peers.delete(id);
    streams.delete(id);

    const tile = document.getElementById(`video-${id}`);
    tile?.remove();
    updateParticipantCount();
}

function updateParticipantCount() {
    const count = videoGrid.querySelectorAll(".video-tile").length;
    participantCount.textContent = `${count} participant${count > 1 ? "s" : ""}`;
}

async function startConnection() {
    let iceServers = fallbackIceServers;
    try {
        const res = await fetch("/turn-credentials");
        if (res.ok) {
            const data = await res.json();
            if (data.iceServers) iceServers = data.iceServers;
        }
    } catch (err) {
        console.warn("Failed to fetch TURN credentials:", err);
    }

    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    const url = `${proto}://${location.host}/ws?room=${encodeURIComponent(roomName)}`;
    // Open WebSocket
    ws = new WebSocket(url);

    ws.onopen = () => {
        setStatus('WebSocket connected');
    };

    ws.onmessage = async (event) => {
        let msg = null;
        try { msg = JSON.parse(event.data); } catch (e) { return; }

        // Handle internal ping/pong
        if (msg.type === 'pong') return;
        if (msg.type === 'ping') { ws.send(JSON.stringify({ type: 'pong' })); return; }

        console.log('Received WS message:', msg);

        switch (msg.type) {
            case 'id':
                peerId = msg.data;
                participantCount.innerText = `You are peer #${peerId}`;
                break;

            case 'users':
                for (const id of msg.data) {
                    if (id !== peerId && !peers.has(id)) {
                        addVideoTile(id, null, `Peer ${id}`);
                        await createOfferToPeer(id, iceServers);
                    }
                }
                break;

            case 'offer':
                addVideoTile(msg.from, null, `Peer ${msg.from}`);
                await handleOffer(msg.from, msg.data, iceServers);
                break;

            case 'answer':
                await handleAnswer(msg.from, msg.data);
                break;

            case 'candidate':
                await handleCandidate(msg.from, msg.data);
                break;

            case 'leave':
                removePeer(msg.from);
                break;

            default:
                console.log('Unknown message type', msg.type);
        }
    };

    ws.onclose = () => {
        setStatus('WebSocket closed');
    };

    ws.onerror = err => {
        console.error('WebSocket error', err);
        setStatus('WebSocket error');
    };

    streamReady = true;
}

async function createOfferToPeer(id, iceServers) {
    const pc = new RTCPeerConnection({ iceServers });
    peers.set(id, pc);

    if (localStream) {
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    }

    pc.ontrack = (event) => {
        attachStreamToTile(id, event.streams[0]);
    };

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            sendMessage("candidate", event.candidate, id);
        }
    };

    pc.onnegotiationneeded = async () => {
        try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            sendMessage("offer", offer, id);
        } catch (err) { console.error("Negotiation error", err); }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    sendMessage("offer", offer, id);
}

function attachStreamToTile(id, stream) {
    const tile = document.getElementById(`video-${id}`);
    if (!tile) return;

    const video = tile.querySelector("video");
    const placeholder = tile.querySelector(".video-placeholder");

    video.srcObject = stream;
    video.style.display = "block";

    if (placeholder) placeholder.style.display = "none";

    setTimeout(() => {
        video.play().catch(err => console.warn("play failed:", err));
    }, 50);
}

async function handleOffer(from, offer, iceServers) {
    const pc = new RTCPeerConnection({ iceServers });
    peers.set(from, pc);

    if (localStream) {
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    }

    pc.ontrack = (event) => {
        console.log(
            "TRACK RECEIVED:",
            "kind =", event.track.kind,
            "streamId =", event.streams[0].id
        );
        addVideoTile(from, event.streams[0], `Peer ${from}`);
    };

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            sendMessage("candidate", event.candidate, from);
        }
    };

    pc.onnegotiationneeded = async () => {
        try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            sendMessage("offer", offer, from);
        } catch (err) { console.error("Negotiation error", err); }
    };

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    sendMessage("answer", answer, from);
}

async function handleAnswer(from, answer) {
    const pc = peers.get(from);
    if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
}

async function handleCandidate(from, candidate) {
    const pc = peers.get(from);
    if (pc) {
        try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
            console.warn("ICE candidate error:", err);
        }
    }
}


function sendMessage(type, data, to = null) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type, data, to }));
    }
}

function endCall() {
    ws?.close();
    peers.forEach(pc => pc.close());
    setStatus('Call ended')
    window.location.href = '/';
}

// Cleanup when user leaves page
window.addEventListener("beforeunload", endCall);
