Library Management System (LMS)
A robust, full-stack Library Management System designed for efficient book cataloging, member registration, bulk data ingestion via CSV/Excel, and real-time circulation tracking (checkouts and check-ins).

🛠️ Tech Stack
Frontend: React (Vite), React Router, HTML5, CSS3

Backend: Python, Flask, Flask-CORS, Pandas, Openpyxl

Database: SQLite (library.db) with relational transactions

Authentication: Firebase Auth & Custom Admin Fallback

📊 Database Schema
The SQLite database (library.db) initializes with four primary tables:

books: Stores ISBN/Book IDs, titles, authors, publishers, genres, prices, publication years, and live available copy counts.

students: Stores student roll numbers, full names, courses, contact details, and academic tracking.

faculty: Stores faculty IDs, names, departments, designations, and contact numbers.

transactions: Tracks active and returned book loans with automatic timestamping and relational joins to books and members.

✨ Features & Capabilities
Librarian Dashboard: Real-time metrics tracking total books, active members, active loans, and a live feed of recent circulation transactions.

Bulk Data Importer: Upload CSV or Excel files (.csv, .xlsx) to instantly ingest Books, Students, or Faculty records with built-in header validation and file/database deduplication.

Catalog Management: View complete book inventories, check real-time availability status, and add new books dynamically.

Member Management: Comprehensive member directory supporting role classification (Student/Faculty), live multi-field searching (by ID, name, email, role, or status), and member activation/deactivation controls.

Circulation Desk:

Real-time autocomplete search for both members and books.

Instant checkout processing that updates available book counts and logs active loans.

Duplicate checkout prevention (prevents issuing the exact same book to the same person twice).

One-click check-in (returns) that restores book inventory counts instantly.

🚀 Setup & Installation
This project requires two concurrent terminal windows to run the Flask backend and the React frontend simultaneously.

1. Clone & Navigate to Project
Bash
git clone <your-repository-url>
cd Library-Management-System
2. Backend Setup (Flask API)
Set up the Python virtual environment and install backend dependencies:

Bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install required dependencies
pip install flask flask-cors pandas openpyxl firebase-admin

# Start the Flask backend server (runs on Port 5000)
python3 app.py
3. Frontend Setup (React / Vite)
Open a second terminal window in the project root:

Bash
# Install frontend packages (if not already installed)
npm install

# Start the development server
npm run dev
🔌 API Endpoints Reference
Method	Endpoint	Description
POST	/api/login	Admin authentication fallback
POST	/api/auth/social	Firebase Google/Social token verification
GET	/api/dashboard/stats	Fetches real-time counts and recent transactions
GET/POST	/api/books	Fetch full book catalog or add a new book
GET/POST	/api/members	Retrieve all members or register a new member
POST	/api/upload	Bulk ingest CSV/Excel spreadsheets with deduplication
POST	/api/checkout	Process book issue and decrement available copies
GET	/api/issued-books	Fetch active loans for a specific member ID
POST	/api/checkin	Process book return and restore inventory copies