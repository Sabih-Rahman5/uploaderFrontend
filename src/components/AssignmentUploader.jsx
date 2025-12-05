import React, { useState } from "react";
import { BACKEND_URL } from "../config/config";
import "./Styles/assignmentUploader.css";

export default function AssignmentUploader() {
  const [file, setFile] = useState(null);
  const [msgAssignment, setMsgAssignment] = useState("");
  const [msgKnowledgeBase, setMsgKnowledgeBase] = useState("");


  const submitAssignment = async (e) => {
    e.preventDefault();
    if (!file) return setMsgAssignment("select a file");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(BACKEND_URL + "upload-assignment/", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    setMsgAssignment("uploaded: " + (data.id || "unknown"));
  };


  const submitKnowledgeBase = async (e) => {
    e.preventDefault();
    if (!file) return setMsgKnowledgeBase("select a file");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(BACKEND_URL + "upload-knowledgebase/", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    setMsgKnowledgeBase("uploaded: " + (data.id || "unknown"));
  };

  return (
    <section className="uploader-section">
      <div className="assignment-uploader">
        <form onSubmit={submitAssignment}>
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

        {msgAssignment && <div className="assignment-uploader__message">{msgAssignment}</div>}
      </div>

      <div className="knowledgebase-uploader uploader-base">
        <form onSubmit={submitKnowledgeBase}>
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

        {msgKnowledgeBase && (
          <div className="knowledgebase-uploader__message uploader-base__message">
            {msgKnowledgeBase}
          </div>
        )}
      </div>
    </section>
  );
}
