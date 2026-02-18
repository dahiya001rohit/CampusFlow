# CampusFlow

**College Resource Booking & Complaint Management System**

CampusFlow is a full-stack MERN application designed to manage college resources and student complaints in a centralized system.
The project focuses heavily on **backend architecture, system design, and clean software engineering practices**.

---

## 🚀 Problem

In many colleges, students book labs/classrooms or report issues through WhatsApp or Google Forms.
This causes:

* booking conflicts
* lost complaints
* no tracking
* no transparency

---

## 💡 Solution

CampusFlow provides a unified platform where:

Students can:

* view and book resources
* raise complaints
* track status

Admins can:

* manage resources
* approve/reject bookings
* resolve complaints

---

## 🧱 Tech Stack

**Frontend:** React + Tailwind
**Backend:** Node.js + Express
**Database:** MongoDB
**Auth:** JWT

---

## 🏗 Architecture

The backend follows a layered architecture:

```
Controllers → Services → Repositories/Models → Database
```

Principles used:

* OOP (encapsulation, abstraction)
* Clean architecture
* Separation of concerns
* RESTful API design

---

## 👥 Actors

* Student
* Admin

---

## ✨ Core Features

* JWT authentication
* Role-based access
* Resource booking workflow
* Complaint tracking
* Admin approval system
* Modular backend structure

---

## 📊 System Diagrams

### Use Case Diagram

![Use Case](docs/usecase.png)

### Sequence Diagram

![Sequence](docs/sequence.png)

### Class Diagram

![Class](docs/class.png)

### ER Diagram

![ER](docs/er.png)

---

## 📁 Project Structure

```
CampusFlow/
│
├── backend/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
│
├── frontend/
├── docs/
│   ├── usecase.png
│   ├── sequence.png
│   ├── class.png
│   └── er.png
│
├── idea.md
├── useCaseDiagram.md
├── sequenceDiagram.md
├── classDiagram.md
├── ErDiagram.md
└── README.md
```

---

## 🧠 Backend Focus (Evaluation Weight: 75%)

This project emphasizes:

* layered backend structure
* service-based architecture
* proper data modeling
* scalable design

---

## 🔮 Future Improvements

* booking conflict detection
* email notifications
* analytics dashboard
* role expansion (faculty)

---

## 👨‍💻 Author

CampusFlow – SESD Milestone Project
