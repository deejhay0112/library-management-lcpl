import paramiko
import pandas as pd
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from datetime import datetime
import pymysql

# SSH details for Hostinger
hostname = '217.21.91.200'  # Replace with your Hostinger SSH IP
port = 65002
username = 'u708474031'
password = 'H0sting#Secure'  # Updated password

# Database connection details
db_host = 'lcplportal.net'
db_user = 'u708474031_lms'
db_password = 'Jedjelodex69'
db_name = 'u708474031_lms'

# Function to upload file to Hostinger via SFTP
def upload_to_hostinger(local_file_path, remote_file_path):
    try:
        transport = paramiko.Transport((hostname, port))
        transport.connect(username=username, password=password)

        sftp = paramiko.SFTPClient.from_transport(transport)
        print(f"Uploading {local_file_path} to {remote_file_path}...")
        sftp.put(local_file_path, remote_file_path)
        print("File uploaded successfully!")

        sftp.close()
        transport.close()
    except Exception as e:
        print(f"An error occurred during file upload: {e}")

# Function to fetch and preprocess data
def fetch_and_preprocess_data():
    try:
        connection = pymysql.connect(host=db_host, user=db_user, password=db_password, database=db_name)
        query = """
            SELECT Date, COUNT(*) as visitor_count
            FROM male_1
            GROUP BY Date
            ORDER BY Date
        """
        df = pd.read_sql(query, connection)
        connection.close()

        # Preprocess data
        df['Date'] = pd.to_datetime(df['Date'])
        df = df.groupby('Date', as_index=False).agg({'visitor_count': 'sum'})
        df['Year'] = df['Date'].dt.year
        df['Month'] = df['Date'].dt.month

        return df
    except Exception as e:
        print(f"Failed to fetch data: {e}")
        return None

# Function to predict future visitor counts
def predict_future(df, future_months=6):
    try:
        # Features and target
        X = df[['Year', 'Month']]
        y = df['visitor_count']

        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train the model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)

        # Calculate accuracy
        y_pred = model.predict(X_test)
        mape = 100 * mean_absolute_error(y_test, y_pred) / y_test.mean()
        print(f"Model Accuracy: {100 - mape:.2f}%")

        # Generate predictions for future months
        last_date = df['Date'].max()
        future_dates = pd.date_range(last_date + pd.offsets.MonthBegin(), periods=future_months, freq='MS')
        future_df = pd.DataFrame({
            'Year': future_dates.year,
            'Month': future_dates.month
        })
        future_df['PredictedVisitors'] = model.predict(future_df)

        return future_df
    except Exception as e:
        print(f"Error during prediction: {e}")
        return None

# Main function
if __name__ == "__main__":
    # Fetch and preprocess data
    df = fetch_and_preprocess_data()
    if df is not None:
        # Predict future visitor counts
        future_predictions = predict_future(df, future_months=6)

        if future_predictions is not None:
            # Save predictions to a local JSON file
            local_file_path = "predictions.json"
            future_predictions.to_json(local_file_path, orient='records')

            # Upload the predictions file to Hostinger
            remote_file_path = "/home/u708474031/domains/lcplportal.net/public_html/predictions.json"
            upload_to_hostinger(local_file_path, remote_file_path)
