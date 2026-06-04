import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function PDFPreview({ fileUrl, onTextExtracted }) {
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pdf, setPdf] = useState(null);

  useEffect(() => {
    return () => {
      if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel(); } catch {}
      }
    };
  }, []);

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
      await renderPage(pdfDoc, 1);
      setLoading(false);

      let fullText = '';
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map(item => item.str).join(' ') + '\n';
      }
      if (onTextExtracted) onTextExtracted(fullText);
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') setLoading(false);
    }
  };

  const renderPage = async (pdfDoc, pageNum) => {
    try {
      if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel(); } catch {}
      }
      const page = await pdfDoc.getPage(pageNum);
      const rotation = page.rotate || 0;
      const viewport = page.getViewport({ scale: 1.5, rotation });
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const ctx = canvas.getContext('2d');
      const renderTask = page.render({ canvasContext: ctx, viewport });
      renderTaskRef.current = renderTask;
      await renderTask.promise;
      renderTaskRef.current = null;
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
