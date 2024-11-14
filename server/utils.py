import numpy as np
import pywt
import plotly.graph_objects as go
from sklearn.ensemble import IsolationForest
from sklearn.metrics import f1_score
from scipy.signal import detrend, savgol_filter
from io import BytesIO
from sklearn.preprocessing import MinMaxScaler

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
    signal_filtered = savgol_filter(signal_detrended, window_length=50, polyorder=3)
    coefficients, freqs = pywt.cwt(signal_filtered, scales, wavelet)
    
    # Calculate power and rescale it to a common range
    power = np.abs(coefficients) ** 2
    avg_power = np.mean(power, axis=0)
    scaler = MinMaxScaler(feature_range=(0, 1))
    avg_power_scaled = scaler.fit_transform(avg_power.reshape(-1, 1)).flatten()
    
    return avg_power_scaled, signal_filtered, signal_detrended


# Modified plotting function to save as image
# def plot_signal(signal, time, start_time, end_time, SID, plot_type):
#     fig = go.Figure()
#     color = 'blue' if plot_type == 'original' else 'orange' if plot_type == 'detrended' else 'green'
#     title = f'{plot_type.capitalize()} Signal for SID: {SID}'
    
#     fig.add_trace(go.Scatter(x=time, y=signal, mode='lines', name=f'{plot_type.capitalize()} Signal', line=dict(color=color)))
#     if start_time is not None:
#         fig.add_vline(x=start_time, line_color='green', line_dash='dash', annotation_text='Start of Oscillation')
#     if end_time is not None:
#         fig.add_vline(x=end_time, line_color='red', line_dash='dash', annotation_text='End of Oscillation')
    
#     fig.update_layout(title=title, xaxis_title='Time (s)', yaxis_title='Signal',xaxis=dict(range=[0, 100]),
#                       showlegend=True)
    
#     image_io = BytesIO()
#     fig.write_image(image_io, format="png")
#     image_io.seek(0)
#     return image_io

def plot_signal(signal, time, start_time=None, end_time=None, SID=None, plot_type='original'):
    """
    Create a plotly figure of a signal with optional start and end time markers.
    
    Args:
        signal (array-like): The signal values to plot
        time (array-like): The time points corresponding to the signal values
        start_time (float, optional): Start time of oscillation to mark
        end_time (float, optional): End time of oscillation to mark
        SID (str, optional): Signal ID for the title
        plot_type (str, optional): Type of plot ('original', 'detrended', or 'filtered')
    
    Returns:
        BytesIO: A bytes buffer containing the PNG image of the plot
    """
    # Input validation
    if len(signal) != len(time):
        raise ValueError("Signal and time arrays must have the same length")
        
    # Set up colors and title
    color_map = {
        'original': 'blue',
        'detrended': 'orange',
        'filtered': 'green'
    }
    color = color_map.get(plot_type, 'blue')  # Default to blue if plot_type not recognized
    title = f'{plot_type.capitalize()} Signal'
    if SID is not None:
        title += f' for SID: {SID}'

    # Create figure
    fig = go.Figure()
    
    # Add main signal trace
    fig.add_trace(
        go.Scatter(
            x=time,
            y=signal,
            mode='lines',
            name=f'{plot_type.capitalize()} Signal',
            line=dict(color=color, width=2)
        )
    )
    
    # Add vertical lines for start and end times if provided
    if start_time is not None:
        fig.add_vline(
            x=start_time,
            line=dict(color='green', dash='dash', width=2),
            annotation_text='Start of Oscillation',
            annotation_position="top"
        )
    
    if end_time is not None:
        fig.add_vline(
            x=end_time,
            line=dict(color='red', dash='dash', width=2),
            annotation_text='End of Oscillation',
            annotation_position="top"
        )
    
    # Update layout with improved styling
    fig.update_layout(
        title=dict(
            text=title,
            x=0.5,  # Center the title
            xanchor='center'
        ),
        xaxis=dict(
            title='Time (s)',
            range=[0, 100],
            showgrid=True,
            gridwidth=1,
            gridcolor='lightgray'
        ),
        yaxis=dict(
            title='Signal',
            showgrid=True,
            gridwidth=1,
            gridcolor='lightgray'
        ),
        showlegend=True,
        legend=dict(
            yanchor="top",
            y=0.99,
            xanchor="right",
            x=0.99
        ),
        plot_bgcolor='white',  # White background
        width=1000,  # Set width explicitly
        height=600   # Set height explicitly
    )
    
    try:
        # Convert to image
        image_io = BytesIO()
        fig.write_image(image_io, format="png")
        image_io.seek(0)
        return image_io
    except Exception as e:
        raise Exception(f"Error converting plot to image: {str(e)}")

# def plot_cwt_power_with_anomalies(avg_power, time, SID, anomalies):
#     fig = go.Figure()
#     fig.add_trace(go.Scatter(x=time, y=avg_power, mode='lines', name='CWT Power', line=dict(color='purple')))
    
#     anomaly_indices = np.where(anomalies == -1)[0]
#     if len(anomaly_indices) > 0:
#         fig.add_trace(go.Scatter(x=[time[anomaly_indices[0]]], y=[avg_power[anomaly_indices[0]]],
#                                  mode='markers', marker=dict(color='black', size=10), name='First Anomaly'))
#         fig.add_trace(go.Scatter(x=[time[anomaly_indices[-1]]], y=[avg_power[anomaly_indices[-1]]],
#                                  mode='markers', marker=dict(color='blue', size=10), name='Last Anomaly'))

#     fig.update_layout(title=f'CWT Power with Anomalies (SID: {SID})', xaxis_title='Time (s)', yaxis_title='Power')

#     image_io = BytesIO()
#     fig.write_image(image_io, format="png")
#     image_io.seek(0)
#     return image_io

from io import BytesIO
import plotly.graph_objects as go
import numpy as np

def plot_cwt_power_with_anomalies(avg_power, time, SID, anomalies):
    """
    Plot CWT power with marked anomalies.
    
    Args:
        avg_power (array-like): Average power values from CWT
        time (array-like): Time points corresponding to power values
        SID (str): Signal ID for the plot title
        anomalies (array-like): Array of anomaly indicators (-1 for anomaly, 1 for normal)
    
    Returns:
        BytesIO: A bytes buffer containing the PNG image of the plot
    """
    # Input validation
    if len(avg_power) != len(time) or len(time) != len(anomalies):
        raise ValueError("avg_power, time, and anomalies arrays must have the same length")
    
    if not isinstance(anomalies, np.ndarray):
        anomalies = np.array(anomalies)
    
    # Create figure
    fig = go.Figure()
    
    # Add main power trace
    fig.add_trace(
        go.Scatter(
            x=time,
            y=avg_power,
            mode='lines',
            name='CWT Power',
            line=dict(
                color='purple',
                width=2
            )
        )
    )
    
    # Add anomaly markers if any exist
    anomaly_indices = np.where(anomalies == -1)[0]
    if len(anomaly_indices) > 0:
        # First anomaly
        fig.add_trace(
            go.Scatter(
                x=[time[anomaly_indices[0]]],
                y=[avg_power[anomaly_indices[0]]],
                mode='markers',
                name='First Anomaly',
                marker=dict(
                    color='red',
                    size=12,
                    symbol='star',
                    line=dict(
                        color='black',
                        width=1
                    )
                )
            )
        )
        
        # Last anomaly
        fig.add_trace(
            go.Scatter(
                x=[time[anomaly_indices[-1]]],
                y=[avg_power[anomaly_indices[-1]]],
                mode='markers',
                name='Last Anomaly',
                marker=dict(
                    color='blue',
                    size=12,
                    symbol='diamond',
                    line=dict(
                        color='black',
                        width=1
                    )
                )
            )
        )
        
        # Add vertical spans to highlight anomaly regions
        fig.add_vrect(
            x0=time[anomaly_indices[0]],
            x1=time[anomaly_indices[-1]],
            fillcolor="red",
            opacity=0.1,
            layer="below",
            line_width=0,
            name="Anomaly Region"
        )
    
    # Update layout with improved styling
    fig.update_layout(
        title=dict(
            text=f'CWT Power with Anomalies (SID: {SID})',
            x=0.5,
            xanchor='center',
            font=dict(size=20)
        ),
        xaxis=dict(
            title='Time (s)',
            showgrid=True,
            gridwidth=1,
            gridcolor='lightgray',
            zeroline=True,
            zerolinewidth=1,
            zerolinecolor='gray'
        ),
        yaxis=dict(
            title='Power',
            showgrid=True,
            gridwidth=1,
            gridcolor='lightgray',
            zeroline=True,
            zerolinewidth=1,
            zerolinecolor='gray'
        ),
        showlegend=True,
        legend=dict(
            yanchor="top",
            y=0.99,
            xanchor="right",
            x=0.99,
            bgcolor="rgba(255, 255, 255, 0.8)"
        ),
        plot_bgcolor='white',
        width=1200,
        height=600,
        hovermode='x unified'
    )
    
    try:
        # Convert to image
        image_io = BytesIO()
        fig.write_image(image_io, format="png")
        image_io.seek(0)
        return image_io
    except Exception as e:
        raise Exception(f"Error converting plot to image: {str(e)}")