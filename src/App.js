import { useState, useRef } from "react";
import "./App.css";
import { extractTextFromPDF, getWordCount } from "./extractPDF";

function App() {

  // ===== STATE VARIABLES =====
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [syllabusText, setSyllabusText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractDone, setExtractDone] = useState(false);

  const fileInputRef = useRef(null);

  // ===== FORMAT FILE SIZE =====
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // ===== HANDLE FILE SELECTION =====
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  // ===== PROCESS THE FILE =====
  const processFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("❌ Please upload a PDF file only.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert("❌ File too large. Please upload a PDF under 20MB.");
      return;
    }
    setPdfFile(file);
    setFileName(file.name);
    setFileSize(formatSize(file.size));
    setExtractDone(false);
    setSyllabusText("");
  };

  // ===== REMOVE FILE =====
  const removeFile = () => {
    setPdfFile(null);
    setFileName("");
    setFileSize("");
    setSyllabusText("");
    setWordCount(0);
    setExtractDone(false);
    fileInputRef.current.value = "";
  };

  // ===== DRAG AND DROP =====
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  // ===== HANDLE ANALYZE =====
  const handleAnalyze = async () => {
    if (!pdfFile) return;
    setIsExtracting(true);
    setExtractDone(false);
    const text = await extractTextFromPDF(pdfFile);
    if (text) {
      setSyllabusText(text);
      const count = getWordCount(text);
      setWordCount(count);
      setExtractDone(true);
      console.log("====== EXTRACTED SYLLABUS TEXT ======");
      console.log(text);
      console.log(`Total words: ${count}`);
    }
    setIsExtracting(false);
  };

  // ===== SCREEN =====
  return (
    <div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-logo">📚 CGPA Booster ✨</div>
        <div className="navbar-tagline">AI-powered study planner for CSE students</div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">✨ Powered by Claude AI</div>
        <h1>Boost Your <span>CGPA</span><br />with AI Guidance</h1>
        <p>
          Upload your college syllabus PDF and get a personalized
          plan — subject difficulty ratings, scoring tips, backlog
          clearer and CGPA roadmap.
        </p>
      </section>

      {/* UPLOAD BOX */}
      <section className="upload-section">
        <div
          className={`upload-box ${isDragging ? "dragging" : ""}`}
          onClick={() => fileInputRef.current.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-icon">📄</div>
          <h3>Upload Your Syllabus PDF</h3>
          <p>Click anywhere here to browse your file</p>
          <p>or drag and drop your PDF into this box</p>
          <p className="upload-hint">Supports PDF files up to 20MB</p>
          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            className="hidden-input"
            onChange={handleFileChange}
          />
        </div>
      </section>

      {/* FILE SELECTED BOX */}
      {fileName && (
        <div style={{ display: "flex", justifyContent: "center", padding: "0 20px" }}>
          <div className="file-selected-box">
            <div className="file-info">
              <span className="file-icon">📋</span>
              <div>
                <div className="file-name">✅ {fileName}</div>
                <div className="file-size">{fileSize}</div>
              </div>
            </div>
            <button className="remove-file" onClick={removeFile}>✕</button>
          </div>
        </div>
      )}

      {/* ANALYZE BUTTON */}
      {pdfFile && (
        <button
          className="btn-analyze"
          onClick={handleAnalyze}
          disabled={isExtracting}
        >
          {isExtracting ? "Reading PDF... ⏳" : "Analyze My Syllabus →"}
        </button>
      )}

      {/* SUCCESS MESSAGE */}
      {extractDone && (
        <div style={{ textAlign: "center", marginTop: "24px", padding: "20px" }}>
          <div style={{
            display: "inline-block",
            background: "#0f2d1f",
            border: "1px solid #166534",
            borderRadius: "12px",
            padding: "20px 32px",
          }}>
            <p style={{ color: "#4ade80", fontSize: "18px", fontWeight: "bold" }}>
              ✅ Syllabus Read Successfully!
            </p>
            <p style={{ color: "#86efac", fontSize: "14px", marginTop: "8px" }}>
              📄 {wordCount.toLocaleString()} words extracted from {fileName}
            </p>
            <p style={{ color: "#166534", fontSize: "13px", marginTop: "6px" }}>
              Ready to send to Claude AI →
            </p>
          </div>

          <div style={{
            marginTop: "20px",
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "12px",
            padding: "20px",
            maxWidth: "560px",
            margin: "20px auto 0 auto",
            textAlign: "left",
          }}>
            <p style={{ color: "#64748b", fontSize: "12px", marginBottom: "8px" }}>
              PREVIEW — First 300 characters extracted:
            </p>
            <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.6" }}>
              {syllabusText.slice(0, 300)}...
            </p>
          </div>
        </div>
      )}

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <p className="subtitle">Four simple steps to transform your academic performance</p>
        <div className="steps-row">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-emoji">📤</div>
            <h4>Upload Syllabus</h4>
            <p>Drop your college syllabus PDF into the tool</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-emoji">🤖</div>
            <h4>AI Analyzes</h4>
            <p>Claude AI rates each subject by global difficulty</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-emoji">🎯</div>
            <h4>Set Your Goals</h4>
            <p>Enter your current CGPA and where you want to reach</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <div className="step-emoji">📈</div>
            <h4>Get Your Plan</h4>
            <p>Receive a personalized week by week study roadmap</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>Built for CSE students 🎓 | CGPA Booster © 2024</p>
      </footer>

    </div>
  );
}

export default App;