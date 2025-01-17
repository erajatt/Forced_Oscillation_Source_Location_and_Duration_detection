# main.py

from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
import pandas as pd
import numpy as np
import time
from io import BytesIO
import base64
import pickle
from database import SessionLocal, engine, Base
from models import FileUpload
import crud
from utils import (
    detect_anomalies_with_optimized_isolation_forest,
    detect_oscillation_start_cwt,
    plot_signal,
    plot_cwt_power_with_anomalies
)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisOptions(BaseModel):
    generators: List[str]
    properties: List[str]

with open("xgb_model_weighted.pkl", "rb") as f:
    xgb_model_weighted = pickle.load(f)

with open("xgb_model_weighted_detection.pkl", "rb") as f:
    xgb_model_weighted_detection = pickle.load(f)

with open("label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

with open("label_encoder_detection.pkl", "rb") as f:
    label_encoder_detection = pickle.load(f)

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open("rf_feature_importances.pkl", "rb") as f:
    rf_feature_importances = pickle.load(f)

with open("rf_feature_importances_detection.pkl", "rb") as f:
    rf_feature_importances_detection = pickle.load(f)
 
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
# Create database tables
Base.metadata.create_all(bind=engine)


@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(('.csv', '.xlsx')):
        raise HTTPException(status_code=400, detail="Invalid file type")

    file_content = await file.read()
    file_upload = crud.create_file_upload(db, file.filename, file_content)
    
    return {"message": "File uploaded successfully", "file_id": file_upload.id}

@app.post("/api/analyze/{file_id}")
async def analyze_data(file_id: int, options: AnalysisOptions, db: Session = Depends(get_db)):
    file_upload = crud.get_file_upload(db, file_id)
    if not file_upload:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        time.sleep(2)

        # Read the uploaded file
        file_content = BytesIO(file_upload.content)
        if file_upload.filename.endswith('.csv'):
            df = pd.read_csv(file_content)
        else:
            df = pd.read_excel(file_content)

        if 'Time' not in df.columns:
            raise HTTPException(status_code=400, detail="Time column not found in the data file")

        selected_columns = ['Time']
        for gen in options.generators:
            gen_number = gen[1:]  # Extract number from G1, G2, etc.
            for prop in options.properties:
                selected_columns.append(f"{prop}{gen_number}")

        # Filter the dataframe to keep only the selected columns
        if not set(selected_columns).issubset(df.columns):
            raise HTTPException(status_code=400, detail="Selected columns not found in the data file")

        filtered_data = df[selected_columns]

        # Convert DataFrame to list of dictionaries to send as JSON
        data = filtered_data.to_dict('records')
        
        # Rename columns to match frontend expectations
        for item in data:
            item['timestamp'] = item.pop('Time')
            for gen in options.generators:
                for prop in options.properties:
                    old_key = f"{prop}{gen[1:]}"
                    new_key = f"{gen}_{prop}"
                    if old_key in item:
                        item[new_key] = item.pop(old_key)

        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/locate_source")
async def locate_source(db: Session = Depends(get_db)):
    # Get the most recent file upload
    file= crud.get_most_recent_file_upload(db)
    if not file:
        raise HTTPException(status_code=404, detail="No uploaded files found")
    
    print(file.filename)

    # Read the file into a DataFrame
    file_content = BytesIO(file.content)
    if file.filename.endswith('.csv'):
        df = pd.read_csv(file_content)
    else:
        df = pd.read_excel(file_content)

    # Assuming the file has similar features as the training data
    FEATURE_COLUMNS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5',
                       'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10',
                       'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10']

    # Filter the relevant columns
    if not all(col in df.columns for col in FEATURE_COLUMNS):
        raise HTTPException(status_code=400, detail="Uploaded file does not contain the required features.")

    test_features = df[FEATURE_COLUMNS]
    test_features_array=np.array(test_features)

    # Step 1: Reshape and scale the test data
    num_samples, num_features = test_features.shape  # Should be (3001, 40)
    test_features_flattened = test_features_array.reshape(1, num_samples * num_features)  # Flatten to (1, 120040)
    # test_features_scaled = scaler.transform(test_features_flattened)

    # Step 2: Apply RF feature importance weighting
    rf_feature_importances_repeated = np.tile(rf_feature_importances, num_samples)
    test_features_weighted = test_features_flattened * rf_feature_importances_repeated

    # Step 3: Use the XGBoost model to make predictions
    predictions= xgb_model_weighted.predict(test_features_weighted)
   
    # Step 4: Decode the predicted label
    predicted_class = label_encoder.inverse_transform(predictions)
    print(predicted_class[0])
    predicted_class_str = str(predicted_class[0])  # Convert to string to ensure JSON serialization
    return {"predicted_source": predicted_class_str}

@app.get("/api/predict_class")
async def predict_class(db: Session = Depends(get_db)):
    # Get the most recent file upload
    file = crud.get_most_recent_file_upload(db)
    if not file:
        raise HTTPException(status_code=404, detail="No uploaded files found")
    
    print(file.filename)

    # Read the file into a DataFrame
    file_content = BytesIO(file.content)
    if file.filename.endswith('.csv'):
        df = pd.read_csv(file_content)
    else:
        df = pd.read_excel(file_content)

    # Assuming the file has similar features as the training data
    FEATURE_COLUMNS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5',
                       'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10',
                       'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10']

    # Filter the relevant columns
    if not all(col in df.columns for col in FEATURE_COLUMNS):
        raise HTTPException(status_code=400, detail="Uploaded file does not contain the required features.")

    test_features = df[FEATURE_COLUMNS]
    test_features_array = np.array(test_features)

    # Step 1: Reshape and scale the test data
    num_samples, num_features = test_features.shape  # Should be (3001, 40)
    test_features_flattened = test_features_array.reshape(1, num_samples * num_features)  # Flatten to (1, 120040)
    # test_features_scaled = scaler.transform(test_features_flattened)

    # Step 2: Apply RF feature importance weighting
    rf_feature_importances_repeated = np.tile(rf_feature_importances_detection, num_samples)
    test_features_weighted = test_features_flattened * rf_feature_importances_repeated

    # Step 3: Use the XGBoost model to make predictions
    predictions = xgb_model_weighted_detection.predict(test_features_weighted)
    predictions = np.array(predictions).reshape(-1)  # Ensure it's a 1D array

    # Step 4: Decode the predicted label
    try:
        predicted_class = label_encoder_detection.inverse_transform(predictions)
        if len(predicted_class) == 0:
            raise HTTPException(status_code=500, detail="Prediction resulted in an empty class.")
        predicted_class_str = str(predicted_class[0])  # Convert to string for JSON response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error decoding predicted class: {str(e)}")

    print(predicted_class_str)
    return {"Predicted class": predicted_class_str}

    

@app.get("/api/detect_duration")
async def detect_duration(db: Session = Depends(get_db)):
    file = crud.get_most_recent_file_upload(db)
    if not file:
        raise HTTPException(status_code=404, detail="No uploaded files found")

    file_content = BytesIO(file.content)
    df = pd.read_excel(file_content) if file.filename.endswith('.xlsx') else pd.read_csv(file_content)
    
    time = df['Time'].values
    signal = df['P1'].values

    scales = np.arange(1, 101)
    avg_power, signal_filtered, signal_detrended = detect_oscillation_start_cwt(signal, scales)

    contamination_values = np.arange(0.05, 0.3, 0.05)
    anomalies, best_contamination = detect_anomalies_with_optimized_isolation_forest(avg_power, contamination_values)

    anomaly_indices = np.where(anomalies == -1)[0]
    min_anomaly_duration=2
    start_time=0
    end_time=0
    duration=0
    if len(anomaly_indices) > 0:
        durations = np.diff(anomaly_indices)
        is_significant_duration = np.insert(durations >= min_anomaly_duration, 0, True)
        significant_anomalies = anomaly_indices[is_significant_duration]
    #     start_time = time[anomaly_indices[0]]
    #     end_time = time[anomaly_indices[-1]]
    # else:
    #     start_time = end_time = None
        if significant_anomalies.size > 0:
            start_time = time[significant_anomalies[0]]
            end_time = time[significant_anomalies[-1]]
            duration = end_time - start_time
        else:
            start_time=None,
            end_time=None,
            duration=None
            return ("No significant forced oscillation detected")
    original_img = plot_signal(signal, time, start_time, end_time, SID=1, plot_type='original')
    detrended_img = plot_signal(signal_detrended, time, start_time, end_time, SID=1, plot_type='detrended')
    filtered_img = plot_signal(signal_filtered, time, start_time, end_time, SID=1, plot_type='filtered')
    cwt_img = plot_cwt_power_with_anomalies(avg_power, time, SID=1, anomalies=anomalies)
    def convert_to_base64(bytes_io):
        bytes_io.seek(0)
        return base64.b64encode(bytes_io.getvalue()).decode()
    return {
        "start_time": start_time,
        "end_time": end_time,
        "duration": duration,
         "original_signal": convert_to_base64(original_img),
        "detrended_signal": convert_to_base64(detrended_img),
        "filtered_signal": convert_to_base64(filtered_img),
        "cwt_power_with_anomalies": convert_to_base64(cwt_img)
    }
    
@app.delete("/api/files/clear")
async def delete_all_files(db: Session = Depends(get_db)):
    try:
        crud.delete_all_files(db)
        return {"message": "All files deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
