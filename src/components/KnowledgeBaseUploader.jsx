import React, { useState } from "react";
import { BACKEND_URL } from "../config/config";

export default function KnowledgebaseUploader() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return setMsg("select a file");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${BACKEND_URL}/upload-knowledgebase/`, {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    setMsg("uploaded knowledgebase id: " + (data.id || "unknown"));
  };

  return (
    <div>
      <form onSubmit={submit}>
        <label>Knowledge Base (PDF):</label>
        <br />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
