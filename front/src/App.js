import React, { useState, useRef } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";

const App = () => {
  const [file, setFile] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [textFromPDF, setTextFromPDF] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    const formData = new FormData();
    formData.append("pdf_file", file);
    try {
      const response = await axios.post("http://localhost:8000/api/extract/", formData);
      const { text_from_pdf, cover_letter } = response.data;
      setTextFromPDF(text_from_pdf);
      setCoverLetter(cover_letter);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTextFromPDF("");
    setCoverLetter(""); // Reset the coverLetter state
    fileInputRef.current.value = null;
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center relative">
      <header className="w-full bg-gray-700 p-4 text-center text-white text-2xl font-semibold fixed top-0 z-10">
        Custom Cover Letter Generator
      </header>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-700 p-8 rounded-lg shadow-md mt-28 mb-40 min-w-[400px] max-w-[1200px]"
      >
        <div className="mb-6">
          <label
            htmlFor="pdf_file"
            className="block text-gray-200 text-sm font-bold mb-2"
          >
            Upload a PDF file:
          </label>
          <input
            type="file"
            id="pdf_file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleButtonClick}
            className="border border-gray-600 bg-gray-600 text-gray-200 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:border-blue-500"
          >
            {file ? file.name : "Click Here To Upload"}
          </button>
        </div>

        {isGenerating ? (
          <div className="flex items-center mt-4">
            <p className="text-gray-200 mr-2">Creating cover letter</p>
            <BeatLoader size={8} color="#ffffff" />
          </div>
        ) : (
          <>
            <button
              type="submit"
              disabled={!file} // Disable the button when no file is uploaded
              className={`bg-gray-600 hover:bg-gray-500 text-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2 ${
                !file ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Submit
            </button>
            {coverLetter && (
              <>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-600 hover:bg-gray-500 text-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Reset
                </button>
                <div className="mt-8 bg-gray-600 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold mb-4 text-gray-200">
                    Extracted Text:
                  </h2>
                  <pre className="text-sm text-gray-200 whitespace-pre-wrap">
                    {coverLetter}
                  </pre>
                </div>
              </>
            )}
          </>
        )}
      </form>
      <footer className="w-full bg-gray-700 p-6 text-center text-white text-sm font-semibold absolute bottom-0">
        <div className="flex justify-center space-x-6 mb-4">
          <a
            href="https://www.linkedin.com/in/nicocabello/"
            className="text-blue-300 hover:text-blue-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/nicoc12024"
            className="text-blue-300 hover:text-blue-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            target="_blank"
            type="button"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200"
            href="mailto:nicoc12024@gmail.com"
          >
            Send me an email
          </a>
        </div>
        <div className="text-gray-400">
          &copy; {new Date().getFullYear()} Nicolás Cabello - All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default App;
