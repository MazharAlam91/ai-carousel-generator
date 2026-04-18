import { useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";

function App() {
  const [idea, setIdea] = useState("");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate slides
  const generateSlides = async () => {
    if (!idea) return alert("Please enter an idea");

    try {
      setLoading(true);

      const res = await axios.post("https://carousel-backend-3ofa.onrender.com/generate", {
        idea,
      });

      setSlides(res.data.slides);
    } catch (error) {
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  // Edit slide
  const handleEdit = (index, field, value) => {
    const updated = [...slides];
    updated[index][field] = value;
    setSlides(updated);
  };

  // Download single slide (without button)
  const downloadSlide = async (index) => {
    const element = document.getElementById(`slide-${index}`);

    // hide buttons
    const btns = element.querySelectorAll(".hide-btn");
    btns.forEach((b) => (b.style.display = "none"));

    const canvas = await html2canvas(element);

    // show buttons again
    btns.forEach((b) => (b.style.display = "block"));

    const link = document.createElement("a");
    link.download = `slide-${index + 1}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const colors = ["#8B5CF6", "#0EA5E9", "#22C55E", "#F59E0B", "#EF4444"];

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial" }}>
      <h1>AI Carousel Generator 🚀</h1>

      {/* Input */}
      <input
        type="text"
        placeholder="e.g. How to stay focused while studying"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          borderRadius: "8px",
          border: "1px solid gray",
        }}
      />

      <br /><br />

      {/* Buttons */}
      <button onClick={generateSlides} style={btnStyle} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      <button onClick={generateSlides} style={btnStyle}>
        🔄 Regenerate
      </button>

      {/* Empty State */}
      {slides.length === 0 && (
        <p style={{ opacity: 0.6 }}>No slides yet. Generate to see results.</p>
      )}

      {/* Slides */}
      <div style={{ marginTop: "30px" }}>
        {slides.map((slide, index) => (
          <div
            key={index}
            id={`slide-${index}`}
            style={{
              background: `linear-gradient(135deg, ${colors[index % 5]}, #000000)`,
              padding: "25px",
              margin: "20px auto",
              width: "320px",
              borderRadius: "15px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
              color: "white",
              textAlign: "center",
              transition: "0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <h4 style={{ opacity: 0.8 }}>Slide {index + 1}</h4>

            {/* Editable Title */}
            <input
              value={slide.title}
              onChange={(e) =>
                handleEdit(index, "title", e.target.value)
              }
              style={{
                border: "none",
                background: "transparent",
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "18px",
                width: "100%",
                outline: "none",
              }}
            />

            {/* Editable Content */}
            <textarea
              value={slide.content}
              onChange={(e) =>
                handleEdit(index, "content", e.target.value)
              }
              style={{
                border: "none",
                background: "transparent",
                color: "white",
                width: "100%",
                textAlign: "center",
                marginTop: "10px",
                outline: "none",
                resize: "none",
              }}
            />

            {/* Buttons */}
            <div style={{ marginTop: "10px" }}>
              <button
                className="hide-btn"
                onClick={() => downloadSlide(index)}
                style={smallBtn}
              >
                📥 Download
              </button>

              <button
                className="hide-btn"
                onClick={() => {
                  navigator.clipboard.writeText(
                    slide.title + "\n" + slide.content
                  );
                  alert("Copied!");
                }}
                style={smallBtn}
              >
                📋 Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "10px 15px",
  margin: "5px",
  borderRadius: "8px",
  background: "black",
  color: "white",
  cursor: "pointer",
};

const smallBtn = {
  margin: "5px",
  padding: "6px 10px",
  borderRadius: "6px",
  background: "white",
  color: "black",
  cursor: "pointer",
};

export default App;