from fastapi import FastAPI, UploadFile, File, HTTPException
from deepface import DeepFace
import os
import shutil
import numpy as np
import cv2

app = FastAPI(title="Hackathon26 Face Service")

# Uygulama başladığında modelleri otomatik indir/yükle (Offline kullanım için)
@app.on_event("startup")
async def load_models():
    print(">>> Modeller kontrol ediliyor ve yerel klasöre indiriliyor (Lütfen bekleyin)...")
    try:
        # Ana modelin indirilmesini tetikle
        DeepFace.build_model("Facenet512")
        
        # Dedektörün (RetinaFace) indirilmesini tetiklemek için sahte bir işlem yap
        dummy_img = np.zeros((224, 224, 3), dtype=np.uint8)
        DeepFace.represent(
            img_path=dummy_img, 
            model_name="Facenet512", 
            detector_backend="retinaface", 
            enforce_detection=False
        )
        print(">>> Başarılı: Tüm modeller hazır ve projenizdeki .deepface klasörüne kaydedildi.")
    except Exception as e:
        print(f">>> Hata: Modeller indirilirken sorun oluştu: {str(e)}")

@app.post("/extract-embedding")
async def extract_embedding(file: UploadFile = File(...)):
    temp_file = f"temp_{file.filename}"
    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        results = DeepFace.represent(
            img_path=temp_file,
            model_name="Facenet512",
            detector_backend="retinaface",
            enforce_detection=True
        )
        
        embedding = results[0]["embedding"]
        return {"embedding": embedding}
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Face detection failed: {str(e)}")
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "face-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
