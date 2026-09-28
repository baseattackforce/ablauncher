const KEY = "openerUrl";

const store = {
    get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} },
    clear() { try { localStorage.removeItem(KEY); } catch (e) {} }
};

function normalize(raw) {
    let url = raw.trim();
    if (!url) return null;
    if (!/^[a-z][a-z0-9+.-]*:/i.test(url)) url = "https://" + url;
    try { return new URL(url).href; } catch (e) { return null; }
}

function launch(url) {
    const win = window.open("about:blank");
    if (!win) return false;

    const esc = url.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

    win.document.write(`<!DOCTYPE html>
<html>
<head>
    <title>Loading...</title>
    <style>
        html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }
        iframe { border: none; width: 100%; height: 100%; }
    </style>
</head>
<body>
    <iframe src="${esc}"></iframe>
</body>
</html>`);
    win.document.close();

    // Set from the opener as well so it survives the document.write reset,
    // and arm it on the first click too: Chrome only shows the
    // "Are you sure you want to leave?" prompt once the page has had a
    // user interaction.
    const guard = (e) => { e.preventDefault(); e.returnValue = ""; return ""; };
    win.addEventListener("beforeunload", guard);
    win.onbeforeunload = guard;
    return true;
}

// Close this tab if the browser allows it. window.close() only works on tabs
// a script opened, so otherwise blank it out instead of leaving the launcher.
function closeSelf() {
    window.close();
    setTimeout(() => { if (!window.closed) location.replace("about:blank"); }, 300);
}

const setup = document.getElementById("setup");
const saved = document.getElementById("saved");
const status = document.getElementById("status");

function showSaved(url) {
    setup.hidden = true;
    saved.hidden = false;
    document.getElementById("launchBtn").onclick = () => run(url);
}

function run(url) {
    if (launch(url)) {
        closeSelf();
    } else {
        status.textContent = "Popup blocked. Allow popups for this site, then press Launch.";
    }
}

document.getElementById("openBtn").onclick = () => {
    const url = normalize(document.getElementById("urlInput").value);
    if (!url) return alert("Enter a valid URL first");
    store.set(url);
    showSaved(url);
    run(url);
};

document.getElementById("changeBtn").onclick = () => {
    store.clear();
    saved.hidden = true;
    setup.hidden = false;
};

const params = new URLSearchParams(location.search);
if (params.has("reset")) store.clear();

const existing = store.get();
if (existing) {
    showSaved(existing);
    // Browsers usually block popups with no click behind them. If this one is
    // blocked, the page stays up with a Launch button, and any click launches.
    if (!launch(existing)) {
        status.textContent = "Click anywhere to launch.";
        document.addEventListener("click", (e) => {
            if (e.target.id === "changeBtn") return;
            run(existing);
        }, { once: true });
    } else {
        closeSelf();
    }
}
