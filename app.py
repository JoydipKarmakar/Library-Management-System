import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app) 

def init_db():
    conn = sqlite3.connect('library.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS books (book_id INTEGER PRIMARY KEY AUTOINCREMENT, isbn TEXT UNIQUE NOT NULL, title TEXT NOT NULL, author TEXT NOT NULL, genre TEXT, total_copies INTEGER DEFAULT 1, available_copies INTEGER DEFAULT 1)''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS members (member_id TEXT PRIMARY KEY, full_name TEXT NOT NULL, email TEXT UNIQUE, account_status TEXT DEFAULT 'Active')''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS circulation (transaction_id INTEGER PRIMARY KEY AUTOINCREMENT, book_isbn TEXT, member_id TEXT, issue_date DATETIME DEFAULT CURRENT_TIMESTAMP, due_date DATETIME NOT NULL, return_date DATETIME, status TEXT DEFAULT 'Issued', FOREIGN KEY(book_isbn) REFERENCES books(isbn), FOREIGN KEY(member_id) REFERENCES members(member_id))''')
    
    cursor.execute("SELECT COUNT(*) FROM books")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO books (isbn, title, author, genre, total_copies, available_copies) VALUES ('978-1449373320', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 'Computer Science', 5, 2)")
        cursor.execute("INSERT INTO members (member_id, full_name, email) VALUES ('M-2041', 'Alex Johnson', 'alex.j@example.com')")
    conn.commit()
    conn.close()

@app.route('/api/books', methods=['GET', 'POST'])
def handle_books():
    conn = sqlite3.connect('library.db')
    cursor = conn.cursor()
    if request.method == 'GET':
        cursor.execute("SELECT title, author, isbn, genre, available_copies, total_copies FROM books")
        books = [{"title": row[0], "author": row[1], "isbn": row[2], "genre": row[3], "available": row[4], "total": row[5]} for row in cursor.fetchall()]
        conn.close()
        return jsonify(books)
    if request.method == 'POST':
        data = request.json
        try:
            cursor.execute("INSERT INTO books (isbn, title, author, genre, total_copies, available_copies) VALUES (?, ?, ?, ?, ?, ?)", (data.get('isbn'), data.get('title'), data.get('author'), data.get('genre'), int(data.get('copies', 1)), int(data.get('copies', 1))))
            conn.commit()
            msg, status = "Book added", 201
        except:
            msg, status = "ISBN exists", 400
        conn.close()
        return jsonify({"message": msg}), status

@app.route('/api/members', methods=['GET', 'POST'])
def handle_members():
    conn = sqlite3.connect('library.db')
    cursor = conn.cursor()
    if request.method == 'GET':
        cursor.execute("SELECT member_id, full_name, email, account_status FROM members")
        members = [{"id": row[0], "name": row[1], "email": row[2], "status": row[3]} for row in cursor.fetchall()]
        conn.close()
        return jsonify(members)
    if request.method == 'POST':
        data = request.json
        try:
            cursor.execute("INSERT INTO members (member_id, full_name, email) VALUES (?, ?, ?)", (data.get('id'), data.get('name'), data.get('email')))
            conn.commit()
            msg, status = "Member registered", 201
        except:
            msg, status = "ID/Email exists", 400
        conn.close()
        return jsonify({"message": msg}), status

@app.route('/api/checkout', methods=['POST'])
def checkout():
    data = request.json
    conn = sqlite3.connect('library.db')
    cursor = conn.cursor()
    cursor.execute("SELECT available_copies FROM books WHERE isbn = ?", (data.get('isbn'),))
    result = cursor.fetchone()
    if result and result[0] > 0:
        cursor.execute("UPDATE books SET available_copies = available_copies - 1 WHERE isbn = ?", (data.get('isbn'),))
        cursor.execute("INSERT INTO circulation (book_isbn, member_id, due_date) VALUES (?, ?, ?)", (data.get('isbn'), data.get('member_id'), datetime.now() + timedelta(days=14)))
        conn.commit()
        msg, status = "Success", 200
    else:
        msg, status = "Unavailable", 400
    conn.close()
    return jsonify({"message": msg}), status

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    
    # This print statement will show you exactly what React sent in your Python terminal
    print("RECEIVED FROM REACT:", data)
    
    # Using a hardcoded admin for simplicity without altering your existing DB tables
    if data and data.get('username') == 'admin' and data.get('password') == 'library2026':
        return jsonify({"message": "Login successful", "token": "mock-jwt-token-123"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

if __name__ == '__main__':
    init_db()
    # host='0.0.0.0' allows external connections inside Codespaces
    app.run(host='0.0.0.0', debug=True, port=5000)