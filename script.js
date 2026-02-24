document.getElementById("openBtn").onclick = () => {
    const url = document.getElementById("urlInput").value.trim();
    if (!url) return alert("Enter a URL first");

    // Must be triggered by a click (user gesture)
    const win = window.open("about:blank");

    if (!win) {
        alert("Popup blocked. Allow popups for this site.");
        return;
    }

    // Escape the URL for safety
    const safeUrl = encodeURI(url);

    // Write a full HTML document into the about:blank tab
    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Loading...</title>
            <style>
                html, body {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    overflow: hidden;
                }
                iframe {
                    border: none;
                    width: 100%;
                    height: 100%;
                }
            </style>
        </head>
        <body>
            <iframe src="${safeUrl}"></iframe>
        </body>
        </html>
    `);

    win.document.close();
};
