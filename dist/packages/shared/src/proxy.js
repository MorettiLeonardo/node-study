"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyTo = proxyTo;
function shouldSendBody(method) {
    return method !== "GET" && method !== "HEAD";
}
function shouldForwardHeader(name) {
    const normalized = name.toLowerCase();
    return ![
        "host",
        "connection",
        "content-length",
        "transfer-encoding",
    ].includes(normalized);
}
function proxyTo({ target }) {
    return async (req, res) => {
        const url = `${target}${req.originalUrl}`;
        const headers = new Headers();
        Object.entries(req.headers).forEach(([key, value]) => {
            if (!value || !shouldForwardHeader(key)) {
                return;
            }
            if (Array.isArray(value)) {
                headers.set(key, value.join(","));
                return;
            }
            headers.set(key, value);
        });
        try {
            const upstream = await fetch(url, {
                method: req.method,
                headers,
                body: shouldSendBody(req.method) && Object.keys(req.body ?? {}).length > 0
                    ? JSON.stringify(req.body)
                    : undefined,
            });
            res.status(upstream.status);
            const contentType = upstream.headers.get("content-type");
            if (contentType) {
                res.setHeader("content-type", contentType);
            }
            const payload = await upstream.text();
            res.send(payload);
        }
        catch (error) {
            res.status(502).json({
                message: "Upstream service unavailable",
                details: error instanceof Error ? error.message : "Unknown proxy error",
            });
        }
    };
}
