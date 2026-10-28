function readPackArtwork(snapshot) {
  if (!snapshot) return null;
  for (const stem of ["thumbnail", "icon", "logo"]) {
    for (const extension of ["png", "webp", "jpg", "jpeg", "ico"]) {
      const bytes = snapshot.readBytes(`${stem}.${extension}`);
      if (!bytes?.length || bytes.length > 1024 * 1024) continue;
      const mime = bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71 ? "image/png" : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? "image/jpeg" : bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 1 && bytes[3] === 0 ? "image/x-icon" : String.fromCharCode(...bytes.subarray(0, 4)) === "RIFF" && String.fromCharCode(...bytes.subarray(8, 12)) === "WEBP" ? "image/webp" : null;
      if (!mime) continue;
      let binary = "";
      for (let offset = 0; offset < bytes.length; offset += 8192) binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
      return `data:${mime};base64,${btoa(binary)}`;
    }
  }
  return null;
}
export {
  readPackArtwork
};
