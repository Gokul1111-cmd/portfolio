import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Plus,
  Trash2,
  Pencil,
  X,
  Award,
  Star,
  FileText,
  UploadCloud,
  Loader2,
  RotateCcw,
  RotateCw,
  Crop as CropIcon,
} from "lucide-react";
import ReactCrop, { convertToPixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebaseClient";

const categories = [
  "AI & Machine Learning",
  "Cloud Computing",
  "Data Science & Analytics",
  "Cybersecurity",
  "Web Development & APIs",
  "Programming",
  "DevOps, IoT & Automation",
  "Blockchain",
  "Mobile & App Design",
  "Competitions",
  "Internships",
  "Soft Skills",
  "Volunteering",
  "Software Testing",
  "Certifications & Tools",
  "Badges & Memberships",
];

const emptyCert = {
  title: "",
  category: categories[0],
  provider: "",
  fileName: "",
  url: "",
  type: "image",
  featured: false,
  tags: "",
};

export const CertificatesEditor = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyCert);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadInfo, setUploadInfo] = useState("");
  const fileInputRef = useRef(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [displayImageSrc, setDisplayImageSrc] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [crop, setCrop] = useState({
    unit: "%",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [cropError, setCropError] = useState("");
  const imgRef = useRef(null);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const setFullCrop = () => {
    if (!imgRef.current) return;
    const { naturalWidth, naturalHeight } = imgRef.current;
    const nextCrop = { unit: "%", x: 0, y: 0, width: 100, height: 100 };
    setCrop(nextCrop);
    setCompletedCrop(convertToPixelCrop(nextCrop, naturalWidth, naturalHeight));
  };

  const onImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    imgRef.current = e.currentTarget;

    // Only set default full-image crop if user hasn't adjusted it yet
    if (!completedCrop) {
      const nextCrop = { unit: "%", x: 0, y: 0, width: 100, height: 100 };
      setCrop(nextCrop);
      setCompletedCrop(
        convertToPixelCrop(nextCrop, naturalWidth, naturalHeight),
      );
    }
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const loadCerts = async () => {
    setLoading(true);
    try {
      console.info("[CertificatesEditor] Fetching certificates...");
      const res = await fetch("/api/certificates");
      console.info("[CertificatesEditor] Fetch status", res.status);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      console.info(
        "[CertificatesEditor] Fetched",
        Array.isArray(data) ? data.length : 0,
        "items",
      );
      setCerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load certificates", err);
    } finally {
      setLoading(false);
    }
  };

  const compressImageIfNeeded = async (file, maxBytes = 2.5 * 1024 * 1024) => {
    if (!file.type.startsWith("image/")) return file;
    if (file.size <= maxBytes) return file;

    let imgBitmap;
    try {
      imgBitmap = await createImageBitmap(file);
    } catch (err) {
      console.error(
        "[CertificatesEditor] createImageBitmap failed",
        { name: file.name, size: file.size, type: file.type },
        err,
      );
      throw err;
    }

    const canvas = document.createElement("canvas");
    canvas.width = imgBitmap.width;
    canvas.height = imgBitmap.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgBitmap, 0, 0);

    let quality = 0.6; // start with 60% quality
    let blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );

    while (blob && blob.size > maxBytes && quality > 0.3) {
      quality -= 0.1;
      blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality),
      );
    }

    if (!blob) return file;
    const newName = file.name.replace(/\.[^.]+$/, "") + "-compressed.jpg";
    return new File([blob], newName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setUploadInfo("Preparing file...");
    setCropError("");

    let processed;
    try {
      processed = await compressImageIfNeeded(file);
    } catch (err) {
      console.error("[CertificatesEditor] Compression failed", err);
      setUploading(false);
      throw err;
    }
    const pathSafeName = processed.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `certificates/${Date.now()}-${pathSafeName}`;
    const storageRef = ref(storage, storagePath);

    setUploadInfo("Uploading to Firebase Storage...");
    try {
      await uploadBytes(storageRef, processed, { contentType: processed.type });
    } catch (err) {
      console.error(
        "[CertificatesEditor] uploadBytes failed",
        { storagePath },
        err,
      );
      setUploading(false);
      throw err;
    }

    let downloadUrl;
    try {
      downloadUrl = await getDownloadURL(storageRef);
    } catch (err) {
      console.error(
        "[CertificatesEditor] getDownloadURL failed",
        { storagePath },
        err,
      );
      setUploading(false);
      throw err;
    }

    setUploading(false);
    setUploadInfo("Upload complete");
    return { downloadUrl, storagePath, processed };
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => {
        console.error("[CertificatesEditor] Image load failed", { url }, error);
        reject(error);
      });
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const buildRotatedPreview = async (src, rotationLocal) => {
    if (!src) return "";
    const image = await createImage(src);
    const rotRad = getRadianAngle(rotationLocal);

    const bBoxWidth = Math.max(
      1,
      Math.abs(Math.cos(rotRad) * image.width) +
        Math.abs(Math.sin(rotRad) * image.height),
    );
    const bBoxHeight = Math.max(
      1,
      Math.abs(Math.sin(rotRad) * image.width) +
        Math.abs(Math.cos(rotRad) * image.height),
    );

    const canvas = document.createElement("canvas");
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;
    const ctx = canvas.getContext("2d");

    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);

    return canvas.toDataURL("image/jpeg", 0.95);
  };

  const getRadianAngle = (deg) => (deg * Math.PI) / 180;

  const getCroppedImg = async (imageSrcLocal, pixelCrop, rotationLocal = 0) => {
    if (
      !pixelCrop ||
      !Number.isFinite(pixelCrop.width) ||
      !Number.isFinite(pixelCrop.height) ||
      pixelCrop.width <= 0 ||
      pixelCrop.height <= 0
    ) {
      throw new Error("Invalid crop box");
    }
    console.info("[CertificatesEditor] Cropping source", {
      srcPresent: Boolean(imageSrcLocal),
      width: pixelCrop.width,
      height: pixelCrop.height,
      rotation: rotationLocal,
    });

    const image = await createImage(imageSrcLocal);

    // First, crop the requested rectangle from the original image
    const cropCanvas = document.createElement("canvas");
    const cropWidth = Math.max(1, Math.floor(pixelCrop.width));
    const cropHeight = Math.max(1, Math.floor(pixelCrop.height));
    cropCanvas.width = cropWidth;
    cropCanvas.height = cropHeight;
    const cropCtx = cropCanvas.getContext("2d");

    const safeX = clamp(
      Math.floor(pixelCrop.x),
      0,
      Math.max(0, image.width - 1),
    );
    const safeY = clamp(
      Math.floor(pixelCrop.y),
      0,
      Math.max(0, image.height - 1),
    );
    const safeW = Math.max(1, Math.min(cropWidth, image.width - safeX));
    const safeH = Math.max(1, Math.min(cropHeight, image.height - safeY));

    cropCtx.drawImage(image, safeX, safeY, safeW, safeH, 0, 0, safeW, safeH);

    // If no rotation, return the cropped blob directly
    if (!rotationLocal) {
      return new Promise((resolve, reject) => {
        cropCanvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Crop failed: empty blob"));
              return;
            }
            resolve(blob);
          },
          "image/jpeg",
          0.9,
        );
      });
    }

    // Rotate the cropped piece
    const rotRad = getRadianAngle(rotationLocal);
    const bBoxWidth = Math.max(
      1,
      Math.abs(Math.cos(rotRad) * cropCanvas.width) +
        Math.abs(Math.sin(rotRad) * cropCanvas.height),
    );
    const bBoxHeight = Math.max(
      1,
      Math.abs(Math.sin(rotRad) * cropCanvas.width) +
        Math.abs(Math.cos(rotRad) * cropCanvas.height),
    );

    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = bBoxWidth;
    outputCanvas.height = bBoxHeight;
    const outputCtx = outputCanvas.getContext("2d");

    outputCtx.translate(bBoxWidth / 2, bBoxHeight / 2);
    outputCtx.rotate(rotRad);
    outputCtx.drawImage(
      cropCanvas,
      -cropCanvas.width / 2,
      -cropCanvas.height / 2,
    );

    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Crop failed: empty blob"));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.9,
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };

      if (editing) {
        const res = await fetch(`/api/certificates?id=${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        console.info("[CertificatesEditor] Update status", res.status);
        if (!res.ok) {
          const text = await res.text();
          console.error("[CertificatesEditor] Update failed body", text);
          throw new Error(`Update failed: ${res.status}`);
        }
        if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      } else {
        const res = await fetch("/api/certificates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        console.info("[CertificatesEditor] Create status", res.status);
        if (!res.ok) {
          const text = await res.text();
          console.error("[CertificatesEditor] Create failed body", text);
          throw new Error(`Create failed: ${res.status}`);
        }
        if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      }

      setForm(emptyCert);
      setEditing(null);
      await loadCerts();
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  const handleFilePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadInfo("");
      setCropError("");
      const isPdf = file.type === "application/pdf";
      if (isPdf && file.size > 5 * 1024 * 1024) {
        alert(
          "PDF compression is not supported in-browser. Please upload a smaller PDF (<5MB) or compress it manually.",
        );
        return;
      }

      if (isPdf) {
        const { downloadUrl, storagePath } = await uploadFile(file);
        setForm((prev) => ({
          ...prev,
          url: downloadUrl,
          fileName: storagePath,
          type: "pdf",
        }));
        return;
      }

      // Images: show cropper before upload
      const reader = new FileReader();
      reader.addEventListener("load", async () => {
        const dataUrl = reader.result.toString();
        setImageSrc(dataUrl);
        setSelectedFile(file);
        setShowCropper(true);
        setRotation(0);
        setCrop({ unit: "%", x: 0, y: 0, width: 100, height: 100 });
        setCompletedCrop(null);
        try {
          const rotated = await buildRotatedPreview(dataUrl, 0);
          setDisplayImageSrc(rotated);
        } catch (err) {
          console.error("Preview build failed", err);
          setDisplayImageSrc(dataUrl);
        }
      });
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("[CertificatesEditor] Upload failed", err);
      alert("Upload failed. Please try again.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setUploading(false);
      setUploadInfo("");
    }
  };

  const handleEdit = (cert) => {
    console.info("[CertificatesEditor] Editing cert", {
      id: cert.id,
      fileName: cert.fileName,
      url: cert.url || cert.image || cert.link,
    });
    setEditing(cert);
    setForm({
      title: cert.title || "",
      category: cert.category || categories[0],
      provider: cert.provider || "",
      fileName: cert.fileName || "",
      url: cert.url || cert.link || cert.image || "",
      type: cert.type || "image",
      featured: Boolean(cert.featured),
      tags: Array.isArray(cert.tags) ? cert.tags.join(", ") : "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this certificate?")) return;
    try {
      await fetch(`/api/certificates?id=${id}`, { method: "DELETE" });
      await loadCerts();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEditExistingImage = async () => {
    if (!form.url && !form.fileName) {
      setCropError("No stored image found for this certificate.");
      return;
    }
    try {
      setLoadingExisting(true);
      setUploadInfo("Fetching image...");
      setCropError("");

      // Use server-side proxy to fetch image and bypass CORS
      let imageUrl = form.url;

      // If no URL but fileName exists, get fresh download URL from Storage
      if (!imageUrl && form.fileName) {
        try {
          imageUrl = await getDownloadURL(ref(storage, form.fileName));
        } catch (err) {
          console.warn(
            "[CertificatesEditor] getDownloadURL failed",
            { fileName: form.fileName },
            err,
          );
          throw new Error("Could not generate download URL for stored file.");
        }
      }

      if (!imageUrl) {
        throw new Error("No URL available to fetch image.");
      }

      console.info("[CertificatesEditor] Fetching via proxy", {
        imageUrl,
        fileName: form.fileName,
      });

      // Fetch through proxy to avoid CORS
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
      const res = await fetch(proxyUrl);

      if (!res.ok) {
        throw new Error(`Proxy fetch failed: ${res.status}`);
      }

      const blob = await res.blob();
      const nameGuess = form.fileName || "existing.jpg";
      const file = new File([blob], nameGuess, {
        type: blob.type || "image/jpeg",
      });

      const reader = new FileReader();
      reader.addEventListener("load", async () => {
        const dataUrl = reader.result.toString();
        setImageSrc(dataUrl);
        setSelectedFile(file);
        setShowCropper(true);
        setRotation(0);
        setCrop({ unit: "%", x: 0, y: 0, width: 100, height: 100 });
        setCompletedCrop(null);
        try {
          const rotated = await buildRotatedPreview(dataUrl, 0);
          setDisplayImageSrc(rotated);
        } catch (err) {
          console.error("Preview build failed", err);
          setDisplayImageSrc(dataUrl);
        }
      });
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(
        "[CertificatesEditor] Fetch existing image failed",
        { url: form.url, fileName: form.fileName },
        err,
      );
      setCropError(
        err?.message || "Could not load the existing image. Try re-uploading.",
      );
    } finally {
      setLoadingExisting(false);
      setUploadInfo("");
    }
  };

  const handleCropComplete = (percentCrop) => {
    if (imgRef.current && percentCrop) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      setCompletedCrop(
        convertToPixelCrop(percentCrop, naturalWidth, naturalHeight),
      );
    }
  };

  const handleApplyCropAndUpload = async () => {
    if (
      !displayImageSrc ||
      !completedCrop ||
      !completedCrop.width ||
      !completedCrop.height
    ) {
      setCropError("Select an area to crop before uploading.");
      return;
    }
    try {
      setUploadInfo("Cropping...");
      setUploading(true);
      console.info(
        "[CertificatesEditor] Cropping with selection",
        completedCrop,
      );
      const blob = await getCroppedImg(displayImageSrc, completedCrop, 0);
      const croppedFile = new File(
        [blob],
        selectedFile?.name || "cropped.jpg",
        {
          type: "image/jpeg",
          lastModified: Date.now(),
        },
      );

      console.info(
        "[CertificatesEditor] Uploading cropped file",
        croppedFile.name,
        croppedFile.size,
      );
      const { downloadUrl, storagePath, processed } =
        await uploadFile(croppedFile);

      console.info("[CertificatesEditor] Upload success", {
        downloadUrl,
        storagePath,
        type: processed.type,
      });

      const nextForm = {
        ...form,
        url: downloadUrl,
        fileName: storagePath,
        type: processed.type === "application/pdf" ? "pdf" : "image",
      };

      setForm(nextForm);

      // Optimistically update the in-memory list so re-editing uses the new image before reload
      if (editing?.id) {
        setCerts((prev) =>
          prev.map((c) =>
            c.id === editing.id
              ? {
                  ...c,
                  url: downloadUrl,
                  image: downloadUrl,
                  fileName: storagePath,
                  type: processed.type === "application/pdf" ? "pdf" : "image",
                  updatedAt: new Date(),
                }
              : c,
          ),
        );

        // Auto-save the updated image to Firestore so re-edit uses the latest
        const payload = {
          ...nextForm,
          tags: nextForm.tags
            ? nextForm.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
        };

        try {
          const res = await fetch(`/api/certificates?id=${editing.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          console.info(
            "[CertificatesEditor] Auto-update after upload status",
            res.status,
          );
          if (!res.ok) {
            const text = await res.text();
            console.error("[CertificatesEditor] Auto-update failed body", text);
            throw new Error(`Auto-update failed: ${res.status}`);
          }
          await loadCerts();
        } catch (err) {
          console.error(
            "[CertificatesEditor] Auto-update after upload failed",
            err,
          );
        }
      }

      setShowCropper(false);
      setImageSrc("");
      setSelectedFile(null);
    } catch (err) {
      console.error("Crop/Upload failed", err);
      setCropError(
        err?.message
          ? `Crop or upload failed: ${err.message}`
          : "Crop or upload failed. Try again or reselect the image.",
      );
    } finally {
      setUploading(false);
      setUploadInfo("");
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex items-center gap-2">
          <Award className="text-primary" />
          <h2 className="text-2xl font-bold">Certificates</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editing ? "Edit Certificate" : "Add Certificate"}
              </h3>
              {editing && (
                <button
                  onClick={() => {
                    setEditing(null);
                    setForm(emptyCert);
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <X size={14} /> Cancel
                </button>
              )}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Upload (auto-compress images over 2.5MB)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFilePick}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <UploadCloud size={14} />
                    )}
                    {uploading ? "Uploading..." : "Choose File"}
                  </button>
                  {uploadInfo && (
                    <span className="text-xs text-muted-foreground">
                      {uploadInfo}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Images over 2.5 MB are compressed automatically before upload.
                  PDFs are uploaded as-is. Images can be cropped/rotated before
                  upload.
                </p>
                {form.url && form.type === "image" && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2">
                      Current preview
                    </p>
                    <div className="border border-border rounded-lg overflow-hidden bg-muted/40">
                      <img
                        src={form.url}
                        alt="Current certificate"
                        className="w-full h-48 object-contain bg-background"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm"
                        onClick={handleEditExistingImage}
                        disabled={
                          loadingExisting || (!form.url && !form.fileName)
                        }
                      >
                        {loadingExisting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CropIcon className="w-4 h-4" />
                        )}
                        Edit current image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Title *
                </label>
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-3 py-2"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Provider
                  </label>
                  <input
                    className="w-full rounded-lg border border-border bg-background px-3 py-2"
                    value={form.provider}
                    onChange={(e) =>
                      setForm({ ...form, provider: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    File name (optional)
                  </label>
                  <input
                    className="w-full rounded-lg border border-border bg-background px-3 py-2"
                    value={form.fileName}
                    onChange={(e) =>
                      setForm({ ...form, fileName: e.target.value })
                    }
                    placeholder="AI AND VECTOR SEARCH_page-0001.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <input
                    className="w-full rounded-lg border border-border bg-background px-3 py-2"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    placeholder="/Certificates/file.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-3 py-2"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="image">Image</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Featured
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tags (comma separated)
                </label>
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="AI, Cloud"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
              >
                {saving ? (
                  <Save size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {editing ? "Update" : "Add"}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Existing Certificates</h3>
              <button
                onClick={() => {
                  setEditing(null);
                  setForm(emptyCert);
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm"
              >
                <Plus size={14} /> New
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <AnimatePresence>
                {loading ? (
                  <p className="text-muted-foreground">Loading...</p>
                ) : certs.length === 0 ? (
                  <p className="text-muted-foreground">No certificates yet.</p>
                ) : (
                  certs.map((cert) => (
                    <motion.div
                      key={cert.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="border border-border rounded-lg p-4 bg-card/60 backdrop-blur"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold line-clamp-2">
                              {cert.title}
                            </p>
                            {cert.featured && (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 border border-amber-500/30">
                                <Star size={12} className="fill-amber-500" />
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {cert.provider || ""}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {cert.category}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(cert)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary text-xs"
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(cert.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 text-red-600 text-xs"
                          >
                            <Trash2 size={12} /> Del
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <FileText size={12} />
                        <span className="line-clamp-1">
                          {cert.url || cert.fileName || cert.image}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCropper && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card border border-border rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2 font-semibold">
                  <CropIcon className="w-4 h-4" />
                  Crop & Rotate
                </div>
                <button
                  className="p-2 rounded-full border border-border hover:border-primary"
                  onClick={() => setShowCropper(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative h-[420px] bg-muted">
                {imageSrc && (
                  <div className="h-full w-full flex items-center justify-center overflow-hidden px-4">
                    <ReactCrop
                      crop={crop}
                      onChange={(nextCrop) => {
                        setCrop(nextCrop);
                        if (imgRef.current && nextCrop) {
                          const { naturalWidth, naturalHeight } =
                            imgRef.current;
                          setCompletedCrop(
                            convertToPixelCrop(
                              nextCrop,
                              naturalWidth,
                              naturalHeight,
                            ),
                          );
                        }
                      }}
                      onComplete={(nextCrop) => handleCropComplete(nextCrop)}
                      keepSelection
                      ruleOfThirds={false}
                    >
                      <img
                        ref={imgRef}
                        src={displayImageSrc || imageSrc}
                        alt="Crop target"
                        onLoad={onImageLoad}
                        style={{
                          maxHeight: 400,
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </ReactCrop>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-border space-y-3">
                {cropError && (
                  <div className="px-3 py-2 rounded-lg border border-amber-500/40 bg-amber-500/10 text-sm text-amber-700">
                    {cropError}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm text-muted-foreground">
                    Drag the handles to resize and move the crop box. Rotation
                    applies on upload.
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3 py-1 rounded border border-border text-sm"
                    onClick={setFullCrop}
                  >
                    Use full image
                  </button>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-16 text-muted-foreground">Rotate</span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded border border-border"
                      onClick={async () => {
                        const next = (((rotation - 90) % 360) + 360) % 360;
                        setRotation(next);
                        try {
                          const rotated = await buildRotatedPreview(
                            imageSrc,
                            next,
                          );
                          setDisplayImageSrc(rotated);
                          setCompletedCrop(null);
                        } catch (err) {
                          console.error("Preview rotate failed", err);
                          setCropError("Preview rotate failed. Try again.");
                        }
                      }}
                    >
                      <RotateCcw className="w-4 h-4" />
                      -90°
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded border border-border"
                      onClick={async () => {
                        const next = (((rotation + 90) % 360) + 360) % 360;
                        setRotation(next);
                        try {
                          const rotated = await buildRotatedPreview(
                            imageSrc,
                            next,
                          );
                          setDisplayImageSrc(rotated);
                          setCompletedCrop(null);
                        } catch (err) {
                          console.error("Preview rotate failed", err);
                          setCropError("Preview rotate failed. Try again.");
                        }
                      }}
                    >
                      <RotateCw className="w-4 h-4" />
                      +90°
                    </button>
                    <span className="text-xs text-muted-foreground">
                      Current: {rotation}°
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border border-border"
                    onClick={() => setShowCropper(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground"
                    disabled={
                      uploading ||
                      !displayImageSrc ||
                      !completedCrop ||
                      !completedCrop.width ||
                      !completedCrop.height
                    }
                    onClick={handleApplyCropAndUpload}
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UploadCloud className="w-4 h-4" />
                    )}
                    Apply & Upload
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
