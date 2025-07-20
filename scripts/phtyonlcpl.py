import requests

# Define the URL to trigger
url = "https://colab.research.google.com/drive/1gHLj01NnyP2SUEg97j5z_O2YruodyAG7#scrollTo=6sn4t-hQqaA-"  # Update with your actual URL

try:
    # Send a GET request to the URL
    response = requests.get(url)
    
    # Check the response status
    if response.status_code == 200:
        print("Successfully triggered the URL.")
    else:
        print(f"Failed to trigger the URL. Status code: {response.status_code}")
except Exception as e:
    print(f"An error occurred: {e}")
