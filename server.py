from flask import Flask, request, jsonify
import mysql.connector
from datetime import datetime

app = Flask(__name__)

# --- MySQL Database Configuration ---
# REPLACE THESE WITH YOUR ACTUAL MySQL DETAILS
DB_CONFIG = {
    'host': 'localhost', # Your MySQL host (e.g., 'localhost', '127.0.0.1', or a remote IP)
    'user': 'root', # The MySQL user you created for this database
    'password': 'root', # The password for your MySQL user
    'database': 'digiroster_attendance' # The database name you created
}

def create_db_connection():
    """Establishes a connection to the MySQL database."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        print(f"--- MySQL connection successful to database '{DB_CONFIG['database']}' ---")
        return conn
    except mysql.connector.Error as err:
        print(f"--- Error connecting to MySQL: {err} ---")
        print("Please check your DB_CONFIG in server.py and ensure MySQL server is running.")
        return None

@app.route('/save_attendance', methods=['POST'])
def save_attendance():
    """
    Handles POST requests to save attendance records to the MySQL database.
    Expects JSON data containing 'rollNo', 'rosterCode', and 'email'.
    """
    # Ensure the request has JSON content
    if not request.is_json:
        print("Received non-JSON request to /save_attendance")
        return "Request must be JSON", 400

    data = request.get_json()
    roll_no = data.get('rollNo')
    roster_code = data.get('rosterCode')
    email = data.get('email')
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Basic validation for required fields
    if roll_no and roster_code and email:
        conn = create_db_connection()
        if conn:
            cursor = conn.cursor()
            try:
                # Using parameterized query (%s placeholders) to prevent SQL injection
                query = """
                INSERT INTO attendance_records (roll_no, roster_code, email, attendance_time)
                VALUES (%s, %s, %s, %s)
                """
                values = (roll_no, roster_code, email, timestamp)
                cursor.execute(query, values)
                conn.commit() # Commit the changes to the database
                print(f"Successfully saved attendance: Roll No={roll_no}, Email={email}, Roster Code={roster_code}")
                return "Attendance data received and saved to database successfully.", 200
            except mysql.connector.Error as err:
                print(f"!!! Error saving attendance to DB: {err} !!!")
                conn.rollback() # Rollback changes if an error occurs
                return f"Error saving attendance to database: {err}", 500
            finally:
                cursor.close()
                conn.close()
        else:
            print("!!! Database connection failed during /save_attendance request !!!")
            return "Database connection failed, unable to save attendance.", 500
    else:
        print(f"Missing data for attendance: Roll No={roll_no}, Roster Code={roster_code}, Email={email}")
        return "Error: Roll Number, Roster Code, or Email missing in data.", 400

# --- Static File Serving ---
# This tells Flask where to find your HTML, CSS, and JS files.
# 'app.static_folder = '.' ' means the current directory where server.py is located.
# Flask will look for files in this directory when requested.
app.static_folder = '.'

@app.route('/')
def serve_login():
    """Serves the main login page (login.html)."""
    return app.send_static_file('login.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serves all other static files (CSS, JS, other HTML pages)."""
    return app.send_static_file(path)

# --- Flask App Runner ---
if __name__ == '__main__':
    print("\n--- Starting Flask Server ---")
    print("Web application available at: http://127.0.0.1:5000/")
    print("Monitoring for incoming requests...")
    # debug=True provides:
    # 1. Automatic reloader: Server restarts automatically on code changes.
    # 2. Debugger: Provides a browser-based debugger for errors.
    app.run(debug=True)
