from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth
import sqlite3
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# --- Firebase Initialization ---
try:
    firebase_admin.initialize_app()
except ValueError:
    pass 

# --- Database Setup (SQLite) ---
DB_NAME = "library.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    
    # Create Books Table
    c.execute('''CREATE TABLE IF NOT EXISTS books (
        "Book ID / ISBN" TEXT PRIMARY KEY, "Title" TEXT, "Author(s)" TEXT, 
        "Publisher" TEXT, "Category / Genre" TEXT, "Price / Cost" TEXT, 
        "Copies Available" INTEGER, "Publication Year" TEXT)''')
    
    # Create Students Table
    c.execute('''CREATE TABLE IF NOT EXISTS students (
        "Student ID / Roll Number" TEXT PRIMARY KEY, "Full Name" TEXT, 
        "Department / Course" TEXT, "Year" TEXT, "Semester" TEXT, 
        "Contact Details" TEXT, "Returned" TEXT, "Active Loan" TEXT, 
        "Active Loan Book" TEXT)''')
    
    # Create Faculty Table
    c.execute('''CREATE TABLE IF NOT EXISTS faculty (
        "Faculty ID" TEXT PRIMARY KEY, "Full Name" TEXT, "Department" TEXT, 
        "Designation" TEXT, "Office Phone" TEXT, "Contact Details" TEXT, 
        "Mobile Phone" TEXT, "Borrowing Status" TEXT)''')
        
    # Transactions Table for Circulation
    c.execute('''CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id TEXT,
        isbn TEXT,
        checkout_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        return_date DATETIME,
        status TEXT DEFAULT 'Active'
    )''')
    
    conn.commit()
    conn.close()

# Run database initialization on server startup
init_db()


# --- Auth Routes ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    
    # Hardcoded admin fallback 
    if data and data.get('username') == 'admin' and data.get('password') == 'library2026':
        return jsonify({"message": "Success", "role": "admin"}), 200
    
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/auth/social', methods=['POST'])
def social_auth():
    auth_header = request.headers.get('Authorization')
    data = request.json or {}
    requested_role = data.get('role', 'student')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "No token provided"}), 401
    token = auth_header.split(' ')[1]
    try:
        decoded_token = auth.verify_id_token(token)
        user_email = decoded_token.get('email', '')
        return jsonify({"message": "Verified", "role": requested_role, "email": user_email}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401


# --- File Upload Route ---
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files or 'type' not in request.form:
        return jsonify({"error": "Missing file or upload type"}), 400
        
    file = request.files['file']
    upload_type = request.form['type']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(file)
        else:
            return jsonify({"error": "Invalid file format. Use CSV or Excel."}), 400

        table_mapping = {
            'book': ('books', 'Book ID / ISBN'),
            'student': ('students', 'Student ID / Roll Number'),
            'faculty': ('faculty', 'Faculty ID')
        }
        
        if upload_type not in table_mapping:
            return jsonify({"error": "Invalid upload type"}), 400
            
        target_table, primary_key = table_mapping[upload_type]

        if primary_key not in df.columns:
            return jsonify({"error": f"Header mismatch. File must contain exact column: '{primary_key}'"}), 400

        original_count = len(df)
        df = df.drop_duplicates(subset=[primary_key], keep='first')
        internal_dupes_removed = original_count - len(df)

        conn = sqlite3.connect(DB_NAME)
        try:
            existing_ids = pd.read_sql(f'SELECT "{primary_key}" FROM {target_table}', conn)
            df = df[~df[primary_key].astype(str).isin(existing_ids[primary_key].astype(str))]
        except Exception:
            pass 

        if df.empty:
            conn.close()
            msg = "All records already exist in the database!"
            if internal_dupes_removed > 0:
                msg += f" (Ignored {internal_dupes_removed} duplicates inside the file)."
            return jsonify({"message": msg}), 200

        try:
            df.to_sql(target_table, conn, if_exists='append', index=False)
        except Exception as sql_err:
            conn.close()
            return jsonify({"error": f"Database insertion rejected the file. Details: {str(sql_err)}"}), 400
            
        conn.close()
        success_msg = f"Successfully imported {len(df)} new records into {target_table}!"
        return jsonify({"message": success_msg}), 200
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


# --- Dashboard Stats Route ---
@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    try:
        c.execute('SELECT COUNT(*) FROM books')
        total_books = c.fetchone()[0]
        
        c.execute('SELECT COUNT(*) FROM students')
        total_students = c.fetchone()[0]
        
        c.execute('SELECT COUNT(*) FROM faculty')
        total_faculty = c.fetchone()[0]
        
        total_members = total_students + total_faculty
        
        c.execute("SELECT COUNT(*) FROM transactions WHERE status = 'Active'")
        active_loans = c.fetchone()[0]
        
        c.execute('''
            SELECT 
                t.id,
                b.Title as title,
                COALESCE(s."Full Name", f."Full Name", t.member_id) as memberName,
                date(t.checkout_date, '+14 days') as dueDate,
                t.status
            FROM transactions t
            LEFT JOIN books b ON t.isbn = b."Book ID / ISBN"
            LEFT JOIN students s ON t.member_id = s."Student ID / Roll Number"
            LEFT JOIN faculty f ON t.member_id = f."Faculty ID"
            ORDER BY t.checkout_date DESC
            LIMIT 5
        ''')
        
        recent_tx = []
        for row in c.fetchall():
            recent_tx.append({
                "id": f"#{row['id']}",
                "title": row['title'] or "Unknown Book",
                "memberName": row['memberName'],
                "dueDate": row['dueDate'],
                "status": row['status']
            })
        
        return jsonify({
            "totalBooks": total_books,
            "activeMembers": total_members,
            "activeLoans": active_loans, 
            "overdueBooks": 0, 
            "recentTransactions": recent_tx 
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


# --- Book Routes ---
@app.route('/api/books', methods=['GET', 'POST'])
def handle_books():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    if request.method == 'POST':
        new_book = request.json
        try:
            c.execute('''INSERT INTO books (
                "Book ID / ISBN", "Title", "Author(s)", "Category / Genre", "Copies Available"
                ) VALUES (?, ?, ?, ?, ?)''', 
                (new_book.get('isbn'), new_book.get('title'), new_book.get('author'), 
                 new_book.get('genre'), new_book.get('totalCopies')))
            conn.commit()
            return jsonify({"message": "Book added successfully!"}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400
        finally:
            conn.close()

    try:
        c.execute('SELECT * FROM books')
        rows = c.fetchall()
        books_list = []
        for row in rows:
            available = int(row["Copies Available"]) if row["Copies Available"] else 0
            books_list.append({
                "id": row["Book ID / ISBN"],
                "isbn": row["Book ID / ISBN"],
                "title": row["Title"],
                "author": row["Author(s)"],
                "genre": row["Category / Genre"],
                "availableCopies": available,
                "totalCopies": available,
                "status": "Available" if available > 0 else "Checked Out"
            })
        return jsonify(books_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


# --- Member Routes ---
@app.route('/api/members', methods=['GET', 'POST'])
def handle_members():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    if request.method == 'POST':
        new_member = request.json
        member_id = new_member.get('id')
        name = new_member.get('name')
        email = new_member.get('email')
        role = new_member.get('role', 'student')
        
        try:
            if role == 'student':
                c.execute('''INSERT INTO students (
                    "Student ID / Roll Number", "Full Name", "Contact Details"
                ) VALUES (?, ?, ?)''', (member_id, name, email))
            elif role == 'faculty':
                c.execute('''INSERT INTO faculty (
                    "Faculty ID", "Full Name", "Contact Details"
                ) VALUES (?, ?, ?)''', (member_id, name, email))
            
            conn.commit()
            return jsonify({"message": "Member registered successfully!"}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400
        finally:
            conn.close()

    members_list = []
    try:
        try:
            c.execute('SELECT "Student ID / Roll Number", "Full Name", "Contact Details" FROM students')
            for row in c.fetchall():
                members_list.append({
                    "id": row["Student ID / Roll Number"],
                    "name": row["Full Name"],
                    "email": row["Contact Details"] if row["Contact Details"] else "N/A",
                    "role": "student",
                    "status": "Active"
                })
        except Exception: pass 
        try:
            c.execute('SELECT "Faculty ID", "Full Name", "Contact Details" FROM faculty')
            for row in c.fetchall():
                members_list.append({
                    "id": row["Faculty ID"],
                    "name": row["Full Name"],
                    "email": row["Contact Details"] if row["Contact Details"] else "N/A",
                    "role": "faculty",
                    "status": "Active"
                })
        except Exception: pass 
        return jsonify(members_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


# --- REAL CIRCULATION ROUTES ---

@app.route('/api/checkout', methods=['POST'])
def checkout():
    data = request.json
    member_id = data.get('member_id')
    isbn = data.get('isbn')
    
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    try:
        # 1. Prevent duplicate active loans for the same book by the same member
        c.execute('''SELECT 1 FROM transactions 
                     WHERE member_id = ? AND isbn = ? AND status = 'Active' LIMIT 1''', 
                  (member_id, isbn))
        if c.fetchone():
            return jsonify({"error": "This member already has an active loan for this specific book."}), 400

        # 2. Check available copies
        c.execute('''SELECT "Copies Available" FROM books WHERE "Book ID / ISBN" = ?''', (isbn,))
        book_data = c.fetchone()
        
        if not book_data:
            return jsonify({"error": "Book not found in database."}), 404
        if book_data[0] <= 0:
            return jsonify({"error": "No copies available for checkout."}), 400

        # 3. Record transaction
        c.execute('''INSERT INTO transactions (member_id, isbn, status)
                     VALUES (?, ?, 'Active')''', (member_id, isbn))
                     
        # 4. Reduce available copies by 1
        c.execute('''UPDATE books SET "Copies Available" = "Copies Available" - 1 
                     WHERE "Book ID / ISBN" = ?''', (isbn,))
                     
        conn.commit()
        return jsonify({"message": "Checkout recorded successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        conn.close()

@app.route('/api/issued-books', methods=['GET'])
def get_issued_books():
    member_id = request.args.get('member_id')
    if not member_id:
        return jsonify([]), 400
        
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    try:
        c.execute('''
            SELECT t.isbn, b.Title as title 
            FROM transactions t
            JOIN books b ON t.isbn = b."Book ID / ISBN"
            WHERE t.member_id = ? AND t.status = 'Active'
        ''', (member_id,))
        
        loans = [{"isbn": row["isbn"], "title": row["title"]} for row in c.fetchall()]
        return jsonify(loans), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/checkin', methods=['POST'])
def checkin():
    data = request.json
    member_id = data.get('member_id')
    isbn = data.get('isbn')
    
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    try:
        c.execute('''
            UPDATE transactions 
            SET status = 'Returned', return_date = CURRENT_TIMESTAMP
            WHERE member_id = ? AND isbn = ? AND status = 'Active'
        ''', (member_id, isbn))
        
        c.execute('''UPDATE books SET "Copies Available" = "Copies Available" + 1 
                     WHERE "Book ID / ISBN" = ?''', (isbn,))
                     
        conn.commit()
        return jsonify({"message": "Book returned successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)