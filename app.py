from flask import Flask, request, jsonify
from flask_cors import CORS       # Cross-Origin support
from chatbot_logic import get_response

app = Flask(__name__)
CORS(app)                          # Allow all cross-origin requests

# Root route
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "AskMITS Backend is running!"})

# Ask route
@app.route("/ask", methods=["POST"])
def ask():
    user_q = request.json.get("question", "")
    answer = get_response(user_q)
    return jsonify({"answer": answer})

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))  # Render provides PORT via env
    app.run(host="0.0.0.0", port=port, debug=True)






























# from flask import Flask, request, jsonify
# from flask_cors import CORS       # ✅ Add this line
# from chatbot_logic import get_response

# app = Flask(__name__)
# CORS(app)                          # ✅ Allow all cross-origin requests

# @app.route("/ask", methods=["POST"])
# def ask():
#     user_q = request.json.get("question", "")
#     answer = get_response(user_q)
#     return jsonify({"answer": answer})

# if __name__ == "__main__":
#     app.run(debug=True)
 