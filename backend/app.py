from flask import Flask, request, jsonify, send_file # type: ignore
from flask_cors import CORS # type: ignore
import jwt # type: ignore
import pymysql # type: ignore
from functools import wraps # type: ignore
from io import BytesIO # type: ignore
from fpdf import FPDF # type: ignore

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = '9a4e3b1c8c2f45679dcbd7c5ad8dfb639807124fc087da98b2a4a4b2a09793cc'

db = pymysql.connect(host="localhost", user="root", password="root", database="faculty")
cursor = db.cursor()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split()[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = data
        except:
            return jsonify({'message': 'Token is invalid!'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'message': 'Email and password are required.'}), 400

    email = data['email']
    password = data['password']
    # Optionally, get a role from the payload, defaulting to "faculty"
    role = data.get('role', 'faculty')

    # Check if the user already exists
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        return jsonify({'message': 'User already exists.'}), 400

    try:
        cursor.execute(
            "INSERT INTO users (email, password, role) VALUES (%s, %s, %s)",
            (email, password, role)
        )
        db.commit()
        return jsonify({'message': 'User created successfully.'}), 201
    except Exception as e:
        db.rollback()
        return jsonify({'message': 'Signup failed.', 'error': str(e)}), 500
    
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (data['email'], data['password']))
    user = cursor.fetchone()
    if user:
        token = jwt.encode({'id': user[0], 'role': user[3]}, app.config['SECRET_KEY'], algorithm="HS256")
        return jsonify({'token': token, 'role': user[3]})
    return jsonify({'message': 'Unauthorized'}), 401

@app.route('/api/faculty', methods=['POST'])
@token_required
def submit_form(current_user):
    data = request.get_json()
    cursor.execute("INSERT INTO faculty (name, publications, events, seminars) VALUES (%s, %s, %s, %s)",
                   (data['name'], data['publications'], data['events'], data['seminars']))
    db.commit()
    return jsonify({'message': 'Submitted'})

@app.route('/api/faculty/submissions', methods=['GET'])
@token_required
def get_faculty(current_user):
    cursor.execute("SELECT * FROM faculty")
    rows = cursor.fetchall()
    keys = ['id', 'name', 'publications', 'events', 'seminars']
    result = [dict(zip(keys, row)) for row in rows]
    return jsonify(result)

@app.route('/api/admin', methods=['GET'])
@token_required
def admin_dashboard(current_user):
    cursor.execute("SELECT * FROM faculty")
    rows = cursor.fetchall()
    keys = ['id', 'name', 'publications', 'events', 'seminars']
    result = [dict(zip(keys, row)) for row in rows]
    return jsonify(result)

@app.route('/api/pdf/<int:id>', methods=['GET'])
@token_required
def generate_pdf(current_user, id):
    cursor.execute("SELECT * FROM faculty WHERE id = %s", (id,))
    row = cursor.fetchone()
    if not row:
        return jsonify({'message': 'Not found'}), 404

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"Faculty Report", ln=True)
    pdf.cell(200, 10, txt=f"Name: {row[1]}", ln=True)
    pdf.multi_cell(0, 10, txt=f"Publications: {row[2]}\nEvents: {row[3]}\nSeminars: {row[4]}")

    # ✅ Correct way to generate PDF binary
    pdf_output = pdf.output(dest='S').encode('latin1')
    buffer = BytesIO(pdf_output)
    buffer.seek(0)

    return send_file(buffer, mimetype='application/pdf', as_attachment=True, download_name=f"Faculty_{id}.pdf")

if __name__ == '__main__':
    app.run(debug=True, port=5000)