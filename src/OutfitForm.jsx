import React, { useState, useEffect } from "react";
import "./ClosetStyle.css";

const CLOTHING_TYPES = ["Top", "Bottom", "Shoes", "Accessory", "Outerwear", "Bag"];

export default function OutfitForm() {
  const [prompt, setPrompt] = useState("");
  const [items, setItems] = useState([{ file: null, tag: "Top" }]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

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
      setItems([...items, { file: null, tag: "Top" }]);
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
      if (item.file) {
        formData.append("files", item.file);
        formData.append("tags", item.tag);
      }
    });

    try {
      const res = await fetch("https://clothingwebapp-backend-production.up.railway.app/generate-outfit/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.image_url) {
        setImageUrl(data.image_url);
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
          <h2>Your Personalized Outfit</h2>
          <img src={imageUrl} alt="Generated fit" />
          <a
            href={imageUrl}
            download="ClosetAI-outfit.png"
            className="download-btn"
          >
            ⬇ Download Your Outfit
          </a>
        </div>
      )}

      <form onSubmit={handleSubmit} className="closet-form">
        <input
          type="text"
          placeholder="What’s the vibe today? (e.g. clean girl, date night, soft grunge)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <p className="prompt-suggestions">
          💡 Try uploading 3-6 clothing pieces and describe the look
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
              type="file"
              accept="image/*"
              onChange={(e) => handleItemChange(index, "file", e.target.files[0])}
            />
            <button type="button" onClick={() => removeItem(index)}>✕</button>
          </div>
        ))}

        <button type="button" onClick={addItem} className="add-btn">+ Add Clothing Image</button>

        <button type="submit" className="submit-btn">
          {loading ? "Styling your fit..." : "Generate My Outfit"}
        </button>
      </form>

      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}

