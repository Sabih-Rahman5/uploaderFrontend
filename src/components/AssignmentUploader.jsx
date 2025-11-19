import React, { useState } from "react";
import { BACKEND_URL } from "../config/config";
import "./Styles/assignmentUploader.css";

export default function AssignmentUploader() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return setMsg("select a file");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(BACKEND_URL + "upload-assignment/", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    setMsg("uploaded: " + (data.id || "unknown"));
  };

  return (
    <section className="uploader-section">
      <div className="assignment-uploader">
        <form onSubmit={submit}>
          <label className="assignment-uploader__label">
            Assignment (PDF):
          </label>

          <input
            type="file"
            accept="application/pdf"
            className="assignment-uploader__input"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button type="submit" className="assignment-uploader__button">
            Upload
          </button>
        </form>

        {msg && <div className="assignment-uploader__message">{msg}</div>}
      </div>

      <div className="knowledgebase-uploader uploader-base">
        <form onSubmit={submit}>
          <label className="knowledgebase-uploader__label uploader-base__label">
            Knowledgebase (PDF):
          </label>

          <input
            type="file"
            accept="application/pdf"
            className="knowledgebase-uploader__input uploader-base__input"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            type="submit"
            className="knowledgebase-uploader__button uploader-base__button"
          >
            Upload
          </button>
        </form>

        {msg && (
          <div className="knowledgebase-uploader__message uploader-base__message">
            {msg}
          </div>
        )}
      </div>
    </section>
  );
}
