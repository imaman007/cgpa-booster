// ===================================================
// extractPDF.js
// This file reads a PDF and pulls out all the text
// ===================================================

import * as pdfjsLib from "pdfjs-dist";

// This tells pdfjs where to find its worker file
// The worker does the heavy lifting of reading PDF pages
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;


// ===================================================
// MAIN FUNCTION - extractTextFromPDF
// Give it a PDF file → it returns all the text inside
// ===================================================

export const extractTextFromPDF = async (file) => {

  try {

    // STEP A — Convert the file into a format pdfjs can read
    // ArrayBuffer is like a raw binary version of the file
    const arrayBuffer = await file.arrayBuffer();

    // STEP B — Load the PDF document
    // This is like opening the PDF
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // STEP C — Find out how many pages the PDF has
    const totalPages = pdf.numPages;
    console.log(`PDF has ${totalPages} pages`);

    // STEP D — Create an empty variable to collect all text
    let fullText = "";

    // STEP E — Loop through every single page
    // i starts at 1 because PDF pages start from 1 not 0
    for (let i = 1; i <= totalPages; i++) {

      // Get the page
      const page = await pdf.getPage(i);

      // Extract the text content from that page
      const content = await page.getTextContent();

      // content.items is an array of text pieces on that page
      // We join them all together with a space between each
      const pageText = content.items
        .map((item) => item.str)
        .join(" ");

      // Add this page's text to our collection
      // \n adds a new line between pages
      fullText += pageText + "\n";

      // Log progress so you can see it working
      console.log(`Page ${i} of ${totalPages} read ✅`);
    }

    // STEP F — Return the complete text from all pages
    return fullText;

  } catch (error) {
    // If something goes wrong, show the error
    console.error("Error reading PDF:", error);
    alert("Could not read this PDF. Please try a different file.");
    return null;
  }

};


// ===================================================
// HELPER FUNCTION - extractSubjectNames
// Pulls just the subject names from the full text
// You will use this in Week 2 when sending to Claude
// ===================================================

export const getWordCount = (text) => {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
};