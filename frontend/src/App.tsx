import { useState } from "react";
import type { FormEvent } from "react";

function App() {
  const [url, setUrl] = useState<string>("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setScreenshot(null);

    try {
      const res = await fetch("http://localhost:5000/screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data: { screenshot?: string } = await res.json();
      if (data.screenshot) {
        setScreenshot(`data:image/png;base64,${data.screenshot}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to take screenshot");
    }

    setLoading(false);
  };

  return (
     <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>URL Screenshot App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: "0.5rem", width: "300px" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>
          OK
        </button>
      </form>

      {loading && <p>Taking screenshot...</p>}

      {screenshot && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Screenshot:</h2>
          <img src={screenshot} alt="Screenshot" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
}

export default App;
