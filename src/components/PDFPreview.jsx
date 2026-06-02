import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function PDFPreview({ fileUrl, onTextExtracted }) {
  const canvasRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pdf, setPdf] = useState(null);

  useEffect(() => {
    if (!fileUrl) {
      setLoading(false);
      return;
    }
    setLoading(true);
    loadPDF(fileUrl);
  }, [fileUrl]);

  const loadPDF = async (url) => {
    try {
      const resp = await fetch(url);
      const buffer = await resp.arrayBuffer();
      const pdfData = new Uint8Array(buffer);
      const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
      setPdf(pdfDoc);
      setNumPages(pdfDoc.numPages);
      renderPage(pdfDoc, 1);
      setLoading(false);

      let fullText = '';
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map(item => item.str).join(' ') + '\n';
      }
      if (onTextExtracted) onTextExtracted(fullText);
    } catch (err) {
      setLoading(false);
    }
  };

  const renderPage = async (pdfDoc, pageNum) => {
    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;
    } catch (err) {}
  };

  const goToPage = (num) => {
    if (!pdf || num < 1 || num > numPages) return;
    setCurrentPage(num);
    renderPage(pdf, num);
  };

  if (!fileUrl) return null;

  return (
    <div className="pdfViewer">
      {loading && <div className="pdfLoading">PDF yukleniyor...</div>}
      <div className="pdfCanvasWrap" style={{ display: loading ? 'none' : 'block' }}>
        <canvas ref={canvasRef} className="pdfCanvas" />
      </div>
      {numPages > 1 && (
        <div className="pdfControls">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>◀</button>
          <span>{currentPage} / {numPages}</span>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= numPages}>▶</button>
        </div>
      )}
    </div>
  );
}
