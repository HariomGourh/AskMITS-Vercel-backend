from flask import Flask, request, jsonify, send_from_directory
import os
from flask_cors import CORS
from chatbot_logic import get_response

app = Flask(__name__, static_folder="frontend")  # frontend folder me HTML/CSS/JS rakho
CORS(app)

@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/ask", methods=["POST"])
def ask():
    user_q = request.json.get("question", "")
    answer = get_response(user_q)
    return jsonify({"answer": answer})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
