document.getElementById("openBtn").onclick = () => {
    const url = document.getElementById("urlInput").value.trim();
    if (!url) return alert("Enter a URL first");

    const win = window.open("about:blank");
    if (!win) {
        alert("Popup blocked. Allow popups for this site.");
        return;
    }

    const safeUrl = encodeURI(url);

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

            <script>
                // Trigger "unsaved changes" dialog
                window.addEventListener("beforeunload", function (e) {
                    e.preventDefault();
                    e.returnValue = "";
                });
            <\/script>
        </body>
        </html>
    `);

    win.document.close();
};

