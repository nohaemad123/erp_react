export interface DecodedObject {
  id: string;
  [key: string]: any;
}

interface PdfViewerProps {
  isLoading: boolean;
  onError?: (error: Error) => void;
}

/**
 * Converts a base64-encoded PDF string to a viewable PDF document in a new browser tab.
 *
 * @param base64Data - The base64-encoded string containing the PDF data. Must not be null.
 * @param options - Optional configuration object for PDF viewer behavior.
 * @param options.onError - Optional callback function to handle any errors during conversion.
 *
 * @throws {Error} Throws an error if base64Data is null or undefined.
 *
 * @example
 * ```
 * // Basic usage
 * base64DecoderToPdf(pdfBase64String);
 *
 * // With error handling
 * base64DecoderToPdf(pdfBase64String, {
 *   onError: (error) => console.error('PDF processing failed:', error)
 * });
 * ```
 */
export function base64DecoderToPdf(base64Data: string | null, options?: PdfViewerProps): void {
  if (!base64Data) {
    throw new Error("PDF data is required");
  }

  try {
    // Create buffer from base64
    const buffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    // Create blob directly from buffer
    const blob = new Blob([buffer], { type: "application/pdf" });

    // Generate URL
    const blobUrl = URL.createObjectURL(blob);

    // Open in new tab
    const newWindow = window.open(blobUrl, "_blank");

    // Cleanup
    if (newWindow) {
      newWindow.onload = () => {
        // Revoke URL after load
        URL.revokeObjectURL(blobUrl);
      };
    } else {
      // Fallback cleanup
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    }
  } catch (error) {
    options?.onError?.(error as Error);
    console.error("Failed to open PDF:", error);
  }
}
