from flask import Flask, request, jsonify
from flask_cors import CORS       # ✅ Add this line
from chatbot_logic import get_response

app = Flask(__name__)
CORS(app)                          # ✅ Allow all cross-origin requests

@app.route("/ask", methods=["POST"])
def ask():
    user_q = request.json.get("question", "")
    answer = get_response(user_q)
    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(debug=True)
 