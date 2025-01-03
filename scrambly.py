from flask import Flask, jsonify, request
import random
from typing import Dict, List

app = Flask(_name_)

# Word categories dictionary
WORD_CATEGORIES: Dict[str, List[str]] = {
    "technology": [
        "computer", "internet", "software", "hardware", "programming",
        "database", "network", "algorithm", "encryption", "cybersecurity"
    ],
    "food": [
        "hamburger", "spaghetti", "pizza", "sandwich", "salad",
        "chocolate", "pancake", "noodles", "sushi", "taco"
    ],
    "family": [
        "mother", "father", "sister", "brother", "grandmother",
        "grandfather", "cousin", "uncle", "aunt", "nephew"
    ],
    "nature": [
        "mountain", "ocean", "forest", "river", "butterfly",
        "elephant", "dolphin", "sunset", "rainbow", "flower"
    ]
}

# Word hints dictionary
WORD_HINTS: Dict[str, str] = {
    "computer": "An electronic device for processing data",
    "internet": "Global network of connected computers",
    "software": "Programs and other operating information",
    "hardware": "Physical parts of a computer",
    "programming": "Writing code to create software",
    "hamburger": "A popular sandwich with a meat patty",
    "spaghetti": "Long, thin pasta noodles",
    "pizza": "Italian dish with toppings on flat bread",
    "sandwich": "Food between two slices of bread",
    "salad": "Mixed vegetables served cold",
    "mother": "Female parent",
    "father": "Male parent",
    "sister": "Female sibling",
    "brother": "Male sibling",
    "grandmother": "Mother of one's parent",
    "mountain": "Large natural elevation of earth",
    "ocean": "Large body of salt water",
    "forest": "Large area covered with trees",
    "river": "Natural flowing watercourse",
    "butterfly": "Flying insect with colorful wings"
}

def scramble_word(word: str) -> str:
    """Scramble the letters of a word while ensuring it's different from the original."""
    word_list = list(word.lower())
    scrambled = word_list.copy()
    while ''.join(scrambled) == word.lower():
        random.shuffle(scrambled)
    return ''.join(scrambled)

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Return all available categories."""
    return jsonify(list(WORD_CATEGORIES.keys()))

@app.route('/api/word/', methods=['GET'])
def get_word(category: str):
    """Return a random word from the specified category."""
    if category not in WORD_CATEGORIES:
        return jsonify({"error": "Category not found"}), 404
    
    word = random.choice(WORD_CATEGORIES[category])
    scrambled = scramble_word(word)
    hint = WORD_HINTS.get(word, "No hint available")
    
    return jsonify({
        "word": word,
        "scrambled": scrambled,
        "hint": hint
    })

@app.route('/api/check', methods=['POST'])
def check_word():
    """Check if the user's answer matches the original word."""
    data = request.get_json()
    user_answer = data.get('answer', '').lower()
    original_word = data.get('original', '').lower()
    
    if not user_answer or not original_word:
        return jsonify({"error": "Missing required fields"}), 400
    
    is_correct = user_answer == original_word
    return jsonify({
        "correct": is_correct,
        "original": original_word
    })

@app.route('/api/skip', methods=['POST'])
def skip_word():
    """Handle skipping a word and return a new one."""
    data = request.get_json()
    category = data.get('category')
    
    if not category or category not in WORD_CATEGORIES:
        return jsonify({"error": "Invalid category"}), 400
    
    word = random.choice(WORD_CATEGORIES[category])
    scrambled = scramble_word(word)
    hint = WORD_HINTS.get(word, "No hint available")
    
    return jsonify({
        "word": word,
        "scrambled": scrambled,
        "hint": hint
    })

# Configuration for serving static files and handling CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

if _name_ == '_main_':
    app.run(debug=True, port=5000)

# Requirements (save as requirements.txt):
# Flask==2.0.1
# python-dotenv==0.19.0

