import requests
import pandas as pd
import nltk

def generate_tagged_word_list(output_file="top_5000_with_pos.csv"):
    # 1. Download the NLTK data needed for tagging
    print("Checking for NLTK data...")
    try:
        nltk.data.find('taggers/averaged_perceptron_tagger')
        nltk.data.find('taggers/universal_tagset')
    except LookupError:
        print("Downloading necessary NLTK datasets...")
        nltk.download('averaged_perceptron_tagger')
        nltk.download('universal_tagset')

    # 2. Fetch the raw word list (Google 10k Dataset)
    url = "https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa-no-swears.txt"
    print(f"Downloading word list from {url}...")
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Split into list and slice top 5000
        all_words = response.text.strip().split('\n')
        top_5000 = all_words[:5000]
        
        # 3. Apply Part of Speech Tagging
        # Note: We use 'universal' tagset for readable tags (NOUN, VERB, ADJ, etc.)
        # tagging isolated words often defaults to Noun if ambiguous, 
        # but NLTK handles common function words (the, is, on) correctly.
        print("Tagging parts of speech...")
        tagged_list = nltk.pos_tag(top_5000, tagset='universal')
        
        # 4. Create DataFrame
        df = pd.DataFrame(tagged_list, columns=['Word', 'Part_of_Speech'])
        
        # Add Rank column
        df.index += 1
        df.index.name = 'Rank'
        
        # Map abbreviations to full names for clarity (Optional)
        pos_map = {
            'NOUN': 'Noun',
            'VERB': 'Verb',
            'ADJ': 'Adjective',
            'ADV': 'Adverb',
            'PRON': 'Pronoun',
            'DET': 'Determiner',
            'ADP': 'Preposition', # Adposition
            'NUM': 'Number',
            'CONJ': 'Conjunction',
            'PRT': 'Particle',
            '.': 'Punctuation',
            'X': 'Other'
        }
        df['Part_of_Speech'] = df['Part_of_Speech'].map(pos_map).fillna(df['Part_of_Speech'])

        # 5. Export
        df.to_csv(output_file)
        print(f"Success! Saved to '{output_file}'")
        
        # Preview
        print("\nPreview:")
        print(df.head(10))

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    generate_tagged_word_list()