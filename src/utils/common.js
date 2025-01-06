// common functions for the frontend

export function generateUniqueId() {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function download(content, fileName, contentType) {
  // generic client-side download prompt
  let a = document.createElement("a");
  let file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  // TODO: delete a?
}
