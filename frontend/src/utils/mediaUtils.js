const MEDIA_BASE_URL = (import.meta.env.VITE_MEDIA_BASE_URL || "").replace(/\/+$/, "");

export function getMediaUrl(rawUrl) {

  if (!rawUrl) {
    return "";
  }

  if (typeof rawUrl !== "string") {
    return "";
  }

  const value = rawUrl.trim();

  if (!value) {
    return "";
  }

  // Keep browser-generated preview URLs unchanged.
  if (
    value.startsWith("blob:") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  // Convert old local backend URLs into same-origin /uploads paths.
  if (
    /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0):3000\/uploads\//i.test(value)
  ) {
    const parsed = new URL(value);

    return MEDIA_BASE_URL
      ? `${MEDIA_BASE_URL}${parsed.pathname}${parsed.search}${parsed.hash}`
      : `${parsed.pathname}${parsed.search}${parsed.hash}`;
  }

  // Already a relative uploads path.
  if (value.startsWith("/uploads/")) {
    return MEDIA_BASE_URL
      ? `${MEDIA_BASE_URL}${value}`
      : value;
  }

  // Other absolute URLs remain unchanged.
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  // Relative media path.
  if (value.startsWith("/")) {
    return MEDIA_BASE_URL
      ? `${MEDIA_BASE_URL}${value}`
      : value;
  }

  // Path without leading slash.
  return MEDIA_BASE_URL
    ? `${MEDIA_BASE_URL}/${value.replace(/^\/+/, "")}`
    : `/${value.replace(/^\/+/, "")}`;
}

export function createObjectURL(file) {
  return file ? URL.createObjectURL(file) : "";
}

export function revokeObjectURL(url) {
  if (url) URL.revokeObjectURL(url);
}

export function isVideoFile(file) {
  return Boolean(file?.type?.startsWith("video/"));
}

export function isImageFile(file) {
  return Boolean(file?.type?.startsWith("image/"));
}

export function formatDuration(seconds) {
  const total = Math.max(0, Math.floor(seconds || 0));
  const mins = String(Math.floor(total / 60)).padStart(2, "0");
  const secs = String(total % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}
