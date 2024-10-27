import torch
import torch.nn as nn
import pandas as pd
import numpy as np
from typing import Union
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from cnn_model import CNNModel

def preprocess_hcup_data(df):
    """
    Clean and preprocess HCUP hurricane data with appropriate handling of:
    - Ordinal hurricane category
    - One-hot encoded proximity columns
    - Continuous average rate
    
    Parameters:
    df (pandas.DataFrame): Raw HCUP dataframe
    
    Returns:
    dict: Processed data and metadata
    """
    df_clean = df.copy()
    
    # Define feature columns by type
    ordinal_cols = ['Hurricane Category']
    onehot_cols = [
        'Hurricane Proximity to the County_Direct path',
        'Hurricane Proximity to the County_Near path',
        'Hurricane Proximity to the County_Remote/FEMA disaster',
        'Hurricane Proximity to the County_Remote/not disaster'
    ]
    continuous_cols = ['Population'] #Pre Rate or Population.
    
    target_cols = [
        'Hurricane Week: Rate per 10,000 Population',
        'Post-Hurricane Week 1: Rate per 10,000 Population',
        'Post-Hurricane Week 2: Rate per 10,000 Population',
        'Post-Hurricane Week 3: Rate per 10,000 Population',
        'Post-Hurricane Week 4: Rate per 10,000 Population',
        'Post-Hurricane Week 5: Rate per 10,000 Population',
        'Post-Hurricane Week 6: Rate per 10,000 Population',
        'Post-Hurricane Week 7: Rate per 10,000 Population'
    ]
    
    for col in continuous_cols:
        if df_clean[col].apply(lambda x: isinstance(x, str)).any():
            df_clean[col] = pd.to_numeric(df_clean[col].str.replace(',', ''), errors='coerce')
    # Check if df_clean contains all columns in target_cols
    if set(target_cols).issubset(df_clean.columns):
        # Convert target columns to numeric
        for col in target_cols:
            df_clean[col] = pd.to_numeric(df_clean[col].str.replace(',', ''), errors='coerce')
        
    # Separate features by type
    X_ordinal = df_clean[ordinal_cols].values  # Already numeric
    X_onehot = df_clean[onehot_cols].values    # Already binary
    X_continuous = df_clean[continuous_cols].values
    if set(target_cols).issubset(df_clean.columns):
        y = df_clean[target_cols].values
    else:
        y=np.array([])
    # Scale continuous features only
    continuous_scaler = StandardScaler()
    X_continuous_scaled = continuous_scaler.fit_transform(X_continuous)
    
    # Scale ordinal features using MinMaxScaler to preserve order
    ordinal_scaler = MinMaxScaler()
    X_ordinal_scaled = ordinal_scaler.fit_transform(X_ordinal)
    
    # Combine all features
    X = np.hstack([X_ordinal_scaled, X_onehot, X_continuous_scaled])
    
    # Handle any remaining missing values
    X = np.nan_to_num(X, nan=np.nanmean(X, axis=0))
    if len(y) == 0:
        y = 0
    else:
        y = np.nan_to_num(y, nan=np.nanmean(y, axis=0))
    return X,y


def predict(model: nn.Module, 
           data: Union[np.ndarray, pd.DataFrame, torch.Tensor],
           preprocess_fn=None) -> np.ndarray:
    """
    Make predictions using a trained model.
    
    Args:
        model: Trained CNNModel
        data: Input data (can be numpy array, pandas DataFrame, or torch tensor)
        preprocess_fn: Optional preprocessing function for input data
        
    Returns:
        numpy.ndarray: Predictions matrix (n_samples x 8 weeks)
    """
    model.eval()  # Set model to evaluation mode
    
    # Preprocess data if needed
    if preprocess_fn is not None and not isinstance(data, torch.Tensor):
        features, _ = preprocess_fn(data)
        X = torch.tensor(features, dtype=torch.float32)
    elif isinstance(data, np.ndarray):
        X = torch.tensor(data, dtype=torch.float32)
    elif isinstance(data, pd.DataFrame):
        X = torch.tensor(data.values, dtype=torch.float32)
    else:
        X = data
    
    # Make predictions
    with torch.no_grad():
        predictions = model(X)
    
    return predictions.numpy()


def get_predictions():
    model = CNNModel()
    model.load_state_dict(torch.load('HCUP_model', map_location=torch.device('cpu'), weights_only=False))

    new_data = pd.read_csv('./new_data.csv')
    predictions = predict(model, new_data, preprocess_fn=preprocess_hcup_data)
    print(predictions)
    return predictions

