"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Something went wrong</h2>
                    <p style={{ color: "#666", marginBottom: "1.5rem" }}>{error.message || "An unexpected error occurred."}</p>
                    <button
                        onClick={reset}
                        style={{ padding: "0.625rem 1.5rem", borderRadius: "0.5rem", backgroundColor: "#0E3B1F", color: "white", border: "none", cursor: "pointer" }}
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
