# Library Management System (LMS)

A robust, full-stack Library Management System designed for efficient book cataloging, member registration, bulk data ingestion via CSV/Excel, and real-time circulation tracking (checkouts and check-ins).

## 🛠️ Tech Stack

* **Frontend:** React (Vite), React Router, HTML5, CSS3
* **Backend:** Python, Flask, Flask-CORS, Pandas, Openpyxl
* **Database:** SQLite (`library.db`) with relational transactions
* **Authentication:** Firebase Auth & Custom Admin Fallback

---

## 📊 Database Schema

The SQLite database (`library.db`) initializes with four primary tables:
1. **`books`**: Stores ISBN/Book IDs, titles, authors, publishers, genres, prices, publication years, and live available copy counts.
2. **`students`**: Stores student roll numbers, full names, courses, contact details, and academic tracking.
3. **`faculty`**: Stores faculty IDs, names, departments, designations, and contact numbers.
4. **`transactions`**: Tracks active and returned book loans with automatic timestamping and relational joins to books and members.

---

## ✨ Features & Capabilities

* **Librarian Dashboard:** Real-time metrics tracking total books, active members, active loans, and a live feed of recent circulation transactions.
* **Bulk Data Importer:** Upload CSV or Excel files (`.csv`, `.xlsx`) to instantly ingest Books, Students, or Faculty records with built-in header validation and file/database deduplication.
* **Catalog Management:** View complete book inventories, check real-time availability status, and add new books dynamically.
* **Member Management:** Comprehensive member directory supporting role classification (Student/Faculty), live multi-field searching (by ID, name, email, role, or status), and member activation/deactivation controls.
* **Circulation Desk:** 
  * Real-time autocomplete search for both members and books.
  * Instant checkout processing that updates available book counts and logs active loans.
  * Duplicate checkout prevention (prevents issuing the exact same book to the same person twice).
  * One-click check-in (returns) that restores book inventory counts instantly.

---

## 🚀 Setup & Installation

This project requires two concurrent terminal windows to run the Flask backend and the React frontend simultaneously.

### 1. Clone & Navigate to Project
```bash
git


<!-- LAST_UPDATED --> *Last automated update: 2026-10-08 05:00:07 UTC*

