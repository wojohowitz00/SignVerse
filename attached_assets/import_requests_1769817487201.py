import requests
import pandas as pd
import os

def download_top_5000(output_file="top_5000_english_words.csv"):
    # URL for the Google 10,000 English words dataset (clean version, no swears)
    url = "https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa-no-swears.txt"
    
    print(f"Downloading word list from {url}...")
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Split text content into a list of lines
        all_words = response.text.strip().split('\n')
        
        # Slice the top 5000
        top_5000 = all_words[:5000]
        
        # Create a DataFrame for better formatting/export options
        df = pd.DataFrame(top_5000, columns=['Word'])
        df.index += 1  # Start ranking at 1 instead of 0
        df.index.name = 'Rank'
        
        # Save to CSV
        df.to_csv(output_file)
        print(f"Success! Top 5,000 words saved to '{output_file}'")
        
        # Optional: Save as a text file (just the words)
        txt_file = output_file.replace('.csv', '.txt')
        with open(txt_file, 'w') as f:
            for word in top_5000:
                f.write(f"{word}\n")
        print(f"Also saved simple text list to '{txt_file}'")
        
        # Preview the first 10
        print("\nPreview of top 10:")
        print(df.head(10))
        
    except Exception as e:
        print(f"Error occurred: {e}")

if __name__ == "__main__":
    download_top_5000()