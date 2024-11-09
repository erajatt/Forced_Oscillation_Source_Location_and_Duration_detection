import numpy as np
import pywt
import plotly.graph_objects as go
from sklearn.ensemble import IsolationForest
from sklearn.metrics import f1_score
from scipy.signal import detrend, savgol_filter
from io import BytesIO

def detect_anomalies_with_optimized_isolation_forest(signal, contamination_values, min_power_threshold=0.02):
    signal_reshaped = signal.reshape(-1, 1)
    best_contamination = contamination_values[0]
    best_f1 = -1
    best_anomalies = None

    for contamination in contamination_values:
        model = IsolationForest(contamination=contamination, random_state=42)
        model.fit(signal_reshaped)
        anomalies = model.predict(signal_reshaped)

        anomaly_ratio = np.mean(anomalies == -1)
        if anomaly_ratio > 0:
            f1 = f1_score(np.ones_like(anomalies) * -1, anomalies, pos_label=-1, zero_division=0)
            if f1 > best_f1:
                best_f1 = f1
                best_contamination = contamination
                best_anomalies = anomalies

    filtered_anomalies = np.where((best_anomalies == -1) & (signal > min_power_threshold), -1, 1)
    return filtered_anomalies, best_contamination

def detect_oscillation_start_cwt(signal, scales, wavelet='morl'):
    signal_detrended = detrend(signal)
    signal_filtered = savgol_filter(signal_detrended, window_length=10, polyorder=3)
    coefficients, freqs = pywt.cwt(signal_filtered, scales, wavelet)
    power = np.abs(coefficients) ** 2
    avg_power = np.mean(power, axis=0)
    return avg_power, signal_filtered, signal_detrended

# Modified plotting function to save as image
def plot_signal(signal, time, start_time, end_time, SID, plot_type):
    fig = go.Figure()
    color = 'blue' if plot_type == 'original' else 'orange' if plot_type == 'detrended' else 'green'
    title = f'{plot_type.capitalize()} Signal for SID: {SID}'
    
    fig.add_trace(go.Scatter(x=time, y=signal, mode='lines', name=f'{plot_type.capitalize()} Signal', line=dict(color=color)))
    if start_time is not None:
        fig.add_vline(x=start_time, line_color='green', line_dash='dash', annotation_text='Start of Oscillation')
    if end_time is not None:
        fig.add_vline(x=end_time, line_color='red', line_dash='dash', annotation_text='End of Oscillation')
    
    fig.update_layout(title=title, xaxis_title='Time (s)', yaxis_title='Signal',xaxis=dict(range=[0, 100]),
                      showlegend=True)
    
    image_io = BytesIO()
    fig.write_image(image_io, format="png")
    image_io.seek(0)
    return image_io

def plot_cwt_power_with_anomalies(avg_power, time, SID, anomalies):
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=time, y=avg_power, mode='lines', name='CWT Power', line=dict(color='purple')))
    
    anomaly_indices = np.where(anomalies == -1)[0]
    if len(anomaly_indices) > 0:
        fig.add_trace(go.Scatter(x=[time[anomaly_indices[0]]], y=[avg_power[anomaly_indices[0]]],
                                 mode='markers', marker=dict(color='black', size=10), name='First Anomaly'))
        fig.add_trace(go.Scatter(x=[time[anomaly_indices[-1]]], y=[avg_power[anomaly_indices[-1]]],
                                 mode='markers', marker=dict(color='blue', size=10), name='Last Anomaly'))

    fig.update_layout(title=f'CWT Power with Anomalies (SID: {SID})', xaxis_title='Time (s)', yaxis_title='Power')

    image_io = BytesIO()
    fig.write_image(image_io, format="png")
    image_io.seek(0)
    return image_io
