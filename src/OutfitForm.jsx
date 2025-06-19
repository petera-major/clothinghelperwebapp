import React, { useState, useEffect } from "react";
import "./ClosetStyle.css";

const CLOTHING_TYPES = ["Top", "Bottom", "Shoes", "Accessory", "Outerwear", "Bag"];

export default function OutfitForm() {
  const [prompt, setPrompt] = useState("");
  const [items, setItems] = useState([{ tag: "Top", description: "" }]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    if (items.length < 6) {
      setItems([...items, { tag: "Top", description: "" }]);
    }
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setImageUrl("");
    setError("");

    const formData = new FormData();
    formData.append("prompt", prompt);
    items.forEach((item) => {
      formData.append("tags", `${item.tag}: ${item.description}`);
    });

    try {
      const res = await fetch("https://clothingwebapp-backend-production.up.railway.app/generate-outfit/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.image_url) {
        setImageUrl(data.image_url);
        setRecommendations(data.recommendations || []);
      } else {
        setError("Something went wrong pookie");
      }
    } catch (err) {
      setError("Backend isn’t picking up");
    }

    setLoading(false);
  };

  return (
    <div className={`closet-app ${darkMode ? "dark" : "light"}`}>
      <header>
        <h1>Your Personal AI Stylist</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Lights On" : "Lights Off"}
        </button>
      </header>

      {imageUrl && (
        <div className="outfit-preview">
          <h2>Your Styled Outfit</h2>
          <img src={imageUrl} alt="Generated outfit" />
          <a href={imageUrl} download="ClosetAI-outfit.png" className="download-btn">
            ⬇ Download Your Outfit
          </a>
          {recommendations.length > 0 && (
            <div className="recommendation-box">
                <h3>Outfit Picks</h3>
                <ul>
                {recommendations.map((rec, idx) => (
                    <li key={idx}>
                    <a href={rec} target="_blank" rel="noopener noreferrer">
                        {rec}
                    </a>
                    </li>
                ))}
                </ul>
            </div>
            )}

        </div>
      )}

      <form onSubmit={handleSubmit} className="closet-form">
        <input
          type="text"
          placeholder="What’s the vibe today? (e.g. cozy, bold, clean girl aesthetic)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <p className="prompt-suggestions">
          💡 Add at least 3–6 clothing pieces with simple descriptions.
        </p>

        {items.map((item, index) => (
          <div className="closet-item-row" key={index}>
            <select
              value={item.tag}
              onChange={(e) => handleItemChange(index, "tag", e.target.value)}
            >
              {CLOTHING_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Describe the item (e.g. cropped black tee)"
              value={item.description}
              onChange={(e) => handleItemChange(index, "description", e.target.value)}
            />
            <button type="button" onClick={() => removeItem(index)}>✕</button>
          </div>
        ))}

        <button type="button" onClick={addItem} className="add-btn">+ Add Item</button>

        <button type="submit" className="submit-btn">
          {loading ? "Styling your fit..." : "Generate My Outfit"}
        </button>
      </form>

      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}