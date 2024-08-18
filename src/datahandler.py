import pandas as pd
import numpy as np

def load_data(filepath):
    df = pd.read_csv(filepath)
    
    # Identify numeric columns
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    
    # Fill NA values in numeric columns with their respective means
    for col in numeric_cols:
        df[col] = df[col].fillna(df[col].mean())
    
    return df

# Load the data when the module is imported
player_data = load_data('complete_player_stats10.csv')