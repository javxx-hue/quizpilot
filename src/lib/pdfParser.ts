// PDF text extractor using pdfjs-dist with graceful fallback
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Dynamic import to avoid SSR or bundle-time worker issues
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker source
    if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
    }

    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    
    let fullText = '';
    const maxPages = Math.min(pdfDoc.numPages, 30); // Process up to 30 pages
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items
        .map((item: any) => item.str || '')
        .filter((str: string) => str.trim().length > 0);
      fullText += pageStrings.join(' ') + '\n\n';
    }

    if (!fullText.trim()) {
      return `[PDF fayl yuklandi: ${file.name} - ${Math.round(file.size / 1024)} KB]`;
    }

    return fullText.trim();
  } catch (error) {
    console.warn('PDF parsing via pdfjs failed, falling back to basic metadata extraction', error);
    return `Mavzu va hujjat: ${file.name.replace(/\.[^/.]+$/, '')} (PDF hajmi: ${Math.round(file.size / 1024)} KB)`;
  }
}
