const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

/**
 * Genera un PDF nuevo que contiene solo las primeras N páginas
 * del PDF original. No modifica el archivo original en disco.
 */
const generarVistaPrevia = async (rutaArchivoOriginal, numPaginas) => {
  const bytesOriginal = fs.readFileSync(rutaArchivoOriginal);
  const pdfOriginal = await PDFDocument.load(bytesOriginal);

  const totalPaginasReal = pdfOriginal.getPageCount();
  const paginasACopiar = Math.min(numPaginas, totalPaginasReal);

  const pdfPreview = await PDFDocument.create();

  // Genera un arreglo de índices: [0, 1, 2, ..., paginasACopiar - 1]
  const indices = Array.from({ length: paginasACopiar }, (_, i) => i);

  const paginasCopiadas = await pdfPreview.copyPages(pdfOriginal, indices);
  paginasCopiadas.forEach((pagina) => pdfPreview.addPage(pagina));

  const bytesPreview = await pdfPreview.save();
  return Buffer.from(bytesPreview);
};

module.exports = { generarVistaPrevia };