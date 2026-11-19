export async function readPoster(file:File) {
  if(!["image/jpeg","image/png","image/webp"].includes(file.type) || file.size>10*1024*1024)throw new Error("Pilih gambar JPG, PNG, atau WebP berukuran maksimal 10 MB.");
  const image=await createImageBitmap(file);
  try{
    const ratio=Math.min(1,960/Math.max(image.width,image.height));
    const canvas=document.createElement("canvas");
    canvas.width=Math.max(1,Math.round(image.width*ratio));canvas.height=Math.max(1,Math.round(image.height*ratio));
    const ctx=canvas.getContext("2d");if(!ctx)throw new Error("Gambar belum dapat dibaca.");
    ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
    for(const q of [.83,.67,.5,.35]){
      const data=canvas.toDataURL("image/jpeg",q);if(data.length<350000)return data;
    }
    throw new Error("Gambar terlalu besar setelah diperkecil. Pilih versi yang lebih ringan.");
  }finally{image.close();}
}
