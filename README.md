# All codes are AI generated
# Library Management System

A full-stack Library Management System designed to handle book cataloging, member registration, and circulation tracking. 

## 🛠️ Tech Stack
* **Frontend:** React (Vite), React Router, HTML/CSS
* **Backend:** Python, Flask, Flask-CORS
* **Database:** SQLite

## ✨ Features
* **Dashboard:** High-level metrics for active loans, total books, and overdue statuses.
* **Catalog Management:** Add new books and track available versus total copies.
* **Member Registration:** Register new library members with unique IDs.
* **Circulation Desk:** Issue books to members using a live autocomplete search for both member IDs and book ISBNs.

## 🚀 Setup & Installation

This project requires two concurrent terminals to run the backend API and the frontend client simultaneously.

### 1. Backend Setup (Flask API)
Navigate to the root directory of the project and set up the Python environment:
```bash
# Create and activate the virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install flask flask-cors

# Start the backend server (runs on Port 5000)
python3 app.py
