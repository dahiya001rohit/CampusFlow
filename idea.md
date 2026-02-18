# CampusFlow – Resource Booking and Complaint Management System

## Overview

CampusFlow is a full-stack web application designed to manage college resources and student complaints in a centralized system.

Students can book college resources such as labs or classrooms and raise complaints regarding infrastructure issues.
Admins can manage resources, approve bookings, and resolve complaints.

The primary focus of this project is backend architecture, system design, and application of software engineering principles.

## Problem Statement

In many colleges, resource booking and complaint handling are done manually or through scattered platforms like WhatsApp or Google Forms.
This leads to:

* booking conflicts
* lost requests
* no tracking system
* poor transparency

## Proposed Solution

CampusFlow provides a unified platform where:

* students can request resource bookings
* students can raise complaints
* admins can approve bookings and resolve complaints
* all requests are tracked with status updates

## Users

### Student

* register/login
* view resources
* request booking
* raise complaint
* track status

### Admin

* manage resources
* approve/reject bookings
* update complaint status
* view all requests

## Key Features

* JWT authentication
* role-based access control
* booking approval workflow
* complaint tracking system
* modular backend architecture
* REST API design
* proper database relationships

## Tech Stack

Frontend: React + Tailwind
Backend: Node.js + Express
Database: MongoDB
Authentication: JWT

## Backend Design Approach

The backend will follow a layered architecture:

* Controllers → handle HTTP requests
* Services → business logic
* Repositories → database operations
* Models → data structure
* Middleware → authentication & authorization

OOP principles such as encapsulation and abstraction will be applied.

## Future Scope

* notification system
* booking conflict detection
* analytics dashboard
* email alerts
