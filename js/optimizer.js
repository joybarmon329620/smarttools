// Elements
const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("fileInput");
const previewSection = document.getElementById("previewSection");
const previewImage = document.getElementById("previewImage");
const resizeWidth = document.getElementById("resizeWidth");
const resizeHeight = document.getElementById("resizeHeight");
const keepRatio = document.getElementById("keepRatio");
const qualityRange = document.getElementById("qualityRange");
const qualityValue = document.getElementById("qualityValue");
const optimizeBtn = document.getElementById("optimizeBtn");
const downloadLink = document.getElementById("downloadLink");
const removeBtn = document.getElementById("removeBtn");
const sizeInfo = document.getElementById("sizeInfo");
const originalSizeEl = document.getElementById("originalSize");
const optimizedSizeEl = document.getElementById("optimizedSize");
const savedPctEl = document.getElementById("savedPct");

let originalDataURL = null;
let originalFileBytes = 0;
let naturalW = 0, naturalH = 0;

function kb(n){ return (n/1024).toFixed(1) + " KB"; }

// --------------- Upload & Drag/Drop ---------------
["dragenter","dragover"].forEach(ev=>{
  uploadBox.addEventListener(ev, e=>{
    e.preventDefault(); e.stopPropagation();
    uploadBox.classList.add("dragover");
  });
});
["dragleave","drop"].forEach(ev=>{
  uploadBox.addEventListener(ev, e=>{
    e.preventDefault(); e.stopPropagation();
    uploadBox.classList.remove("dragover");
  });
});
uploadBox.addEventListener("drop", e=>{
  const file = e.dataTransfer.files[0];
  if(file) handleFile(file);
});
uploadBox.addEventListener("click", ()=> fileInput.click());
fileInput.addEventListener("change", e=>{
  const f = e.target.files[0];
  if(f) handleFile(f);
});
uploadBox.addEventListener("keydown", e=>{
  if(e.key === "Enter" || e.key === " ") fileInput.click();
});

// --------------- Handle file ---------------
function handleFile(file){
  if(!file.type.startsWith("image/")){
    alert("Please choose an image file."); return;
  }
  originalFileBytes = file.size;
  originalSizeEl.textContent = kb(originalFileBytes);
  sizeInfo.classList.add("hidden");

  const reader = new FileReader();
  reader.onload = evt=>{
    originalDataURL = evt.target.result;
    showPreview(originalDataURL);
  };
  reader.readAsDataURL(file);
}

// --------------- Show preview ---------------
function showPreview(dataURL){
  previewImage.src = dataURL;
  previewSection.classList.remove("hidden");
  downloadLink.classList.add("hidden");
  removeBtn.classList.remove("hidden");

  const img = new Image();
  img.onload = ()=>{
    naturalW = img.naturalWidth;
    naturalH = img.naturalHeight;
    resizeWidth.value = naturalW;
    resizeHeight.value = naturalH;
  };
  img.src = dataURL;
}

// --------------- Keep ratio ---------------
resizeWidth.addEventListener("input", ()=>{
  if(keepRatio.checked && naturalW && naturalH){
    resizeHeight.value = Math.round(parseInt(resizeWidth.value)*naturalH/naturalW);
  }
});
resizeHeight.addEventListener("input", ()=>{
  if(keepRatio.checked && naturalW && naturalH){
    resizeWidth.value = Math.round(parseInt(resizeHeight.value)*naturalW/naturalH);
  }
});
qualityRange.addEventListener("input", ()=> qualityValue.textContent = qualityRange.value);

// --------------- Optimize ---------------
optimizeBtn.addEventListener("click", ()=>{
  if(!originalDataURL) return alert("Upload an image first!");

  const img = new Image();
  img.onload = ()=>{
    const w = parseInt(resizeWidth.value)||img.naturalWidth;
    const h = parseInt(resizeHeight.value)||img.naturalHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img,0,0,w,h);

    const q = Math.max(0.1, parseInt(qualityRange.value)/100);
    canvas.toBlob(blob=>{
      const url = URL.createObjectURL(blob);
      previewImage.src = url;

      const optimizedBytes = blob.size;
      optimizedSizeEl.textContent = kb(optimizedBytes);
      const saved = Math.max(0, Math.round((1-optimizedBytes/originalFileBytes)*100));
      savedPctEl.textContent = saved + "%";
      sizeInfo.classList.remove("hidden");

      downloadLink.href = url;
      downloadLink.download = "optimized-"+Date.now()+".jpg";
      downloadLink.classList.remove("hidden");
    },"image/jpeg",q);
  };
  img.src = originalDataURL;
});

// --------------- Remove image ---------------
removeBtn.addEventListener("click", ()=>{
  previewSection.classList.add("hidden");
  fileInput.value = "";
  originalDataURL = null;
  previewImage.src = "";
  removeBtn.classList.add("hidden");
});
