from flask import Flask, request, jsonify
import os
import importlib
assistant_backend = importlib.import_module("assistant-backend")
import db

db.connect_db()
app = Flask(__name__)

UPLOAD_FOLDER = "uploads" 
ALLOWED_EXTENSIONS = {'txt', "pdf"}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def hello_world():
    return "<p>Jožo</p>"

@app.route("/instructions", methods=["POST"])
def handle_instructions():

    if 'file' in request.files:
        file = request.files['file']
        if file and allowed_file(file.filename):
            instruction = file.read().decode('utf-8')
        else:
            return jsonify({"error": "Invalid file type. Only .txt files are allowed."}), 400
    elif 'text' in request.form:
        instruction = request.form['text']
        if not instruction.strip():
            return jsonify({"error": "Instruction text cannot be empty."}), 400
    else:
        return jsonify({"error": "No valid input provided. Submit a file or text."}), 400

    try:
        if 'name' in request.json:
            db.add_instruction(request.json.name, instruction)
        else:
            return jsonify({"error": "Instruction name not provided."}), 400
        return jsonify({"message": "Instruction saved successfully!", "instruction": instruction}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to save instruction: {str(e)}"}), 500

@app.route("/instructions/", methods=["GET"])
def get_instructions():
    try:
        instructions = db.get_organization_instructions_names("67422b83b2481aa16b6daf63")
        return jsonify({"instructions": instructions}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve instructions: {str(e)}"}), 500

@app.route("/upload", methods=["POST"])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    app.logger.info(f"Type of file object: {type(file)}")
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        app.logger.info(f"File {filename} saved to {file_path}")
        return jsonify({"message": f"File {filename} uploaded successfully!", "file_path": file_path}), 200

    return jsonify({"error": "Invalid file type. Only .txt and .pdf files are allowed."}), 400



@app.route("/assistant", methods=["POST"])
def send_to_assistant():

    file = request.files.get('file')
    instruction_id = request.form.get('instruction_id')
    thread_id = request.form.get('thread_id')
    instruction = None
    if not thread_id:
        thread_id = assistant_backend.createThread()
        app.logger.info(f"Type of file object: {thread_id}")

    if not file or not allowed_file(file.filename):
        return jsonify({"error": "Invalid or missing file. Only .txt and .pdf files are allowed."}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    try:
        if instruction_id:
            instruction = db.get_instruction(instruction_id)
            if not instruction:
                #return jsonify({"error": f"Instruction with ID {instruction_id} not found."}), 404
                instruction = "find spelling mistakes in this file"

        if not instruction:
            instruction = request.form.get('instruction')
            if not instruction:
                #return jsonify({"error": "No instruction provided or selected."}), 400
                instruction = "find spelling mistakes in this file"

        with open(file_path, 'rb') as file_obj:
            response = assistant_backend.analyzeFile(file_obj, instruction, id_thread=thread_id)
        
        return jsonify({"message": "Request sent successfully!", "response": response}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to process the request: {str(e)}"}), 500
    finally:
        #os.remove(file_path)
        pass



if __name__ == "__main__":
    app.run(debug=True)
