import { useState, useEffect } from "react";
import DOMPurify from "dompurify";

export const useSanitizeHtml = (html: string) => {
  const [sanitizedHtml, setSanitizedHtml] = useState("");

  useEffect(() => {
    const sanitized = DOMPurify.sanitize(html);
    setSanitizedHtml(sanitized);
  }, [html]);

  return sanitizedHtml;
};