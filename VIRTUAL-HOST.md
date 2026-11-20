# Virtual livestream host

A standalone animated virtual humanoid host and stream overlay is available at [`virtual-host.html`](virtual-host.html).

## Run locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/virtual-host.html`. The host can speak typed text using the browser's speech synthesis, with optional microphone speech recognition where supported. The chat is a local preview only.

## Use as a stream overlay

Click **Open clean stream overlay** and add that page as a browser source in your streaming software (for example OBS). You can also use `http://localhost:8080/virtual-host.html?overlay=1` as the browser-source URL while the local server is running. Set the browser source dimensions to match your scene and enable transparency if supported.

This is a visual/demo overlay. It does not connect to TikTok, read TikTok live chat, or broadcast video. Use the streaming platform and software's official integration and follow their current rules. A browser's speech, voice list, and microphone support vary by device; microphone access generally requires HTTPS or localhost.
