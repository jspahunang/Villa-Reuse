const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png"];

export interface Uploader {
  getFile(): File | null;
  getDataUrl(): string | null;
  setDataUrl(url: string, labelText?: string): void;
}

export function mountPhotoUploader(
  zone: HTMLElement,
  input: HTMLInputElement,
  preview: HTMLImageElement,
  label: HTMLElement,
  onError: (message: string) => void,
): Uploader {
  let current: File | null = null;
  let currentDataUrl: string | null = null;

  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;

    if (!ALLOWED.includes(file.type)) {
      onError("Please choose a JPG or PNG image.");
      input.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      onError("That image is larger than 10 MB.");
      input.value = "";
      return;
    }

    current = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      currentDataUrl = e.target?.result as string;
      preview.src = currentDataUrl;
      preview.hidden = false;
      label.textContent = file.name;
      zone.classList.add("upload-zone--has-photo");
    };
    reader.readAsDataURL(file);
  });

  return {
    getFile: () => current,
    getDataUrl: () => currentDataUrl,
    setDataUrl: (url: string, labelText = "Selected photo") => {
      current = null;
      currentDataUrl = url;
      preview.src = url;
      preview.hidden = false;
      label.textContent = labelText;
      zone.classList.add("upload-zone--has-photo");
    },
  };
}
