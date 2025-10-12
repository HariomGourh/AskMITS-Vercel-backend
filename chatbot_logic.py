import os, json, random
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Define dataset path
BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, "data", "university_dataset.json")

# Load dataset
with open(DATA_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

# Extract all patterns (questions) and responses
questions, answers = [], []
for intent in data["intents"]:
    for text in intent["text"]:
        questions.append(text)
        answers.append(random.choice(intent["responses"]))

# Create TF-IDF model
vectorizer = TfidfVectorizer().fit(questions)
vectors = vectorizer.transform(questions)

# Function to get chatbot response
def get_response(user_input):
    user_vec = vectorizer.transform([user_input])
    similarity = cosine_similarity(user_vec, vectors).flatten()
    idx = similarity.argmax()
    
    if similarity[idx] > 0.3:  # threshold
        return answers[idx]
    else:
        return "I'm sorry, I don't have that information yet. Try asking differently."
