# Sequence Diagram – Booking Flow

![Sequence](images/sequenceDiagram.png)

## Scenario

Student requests a resource booking and the system processes it.

## Steps

1. Student selects resource and time slot
2. Frontend sends booking request
3. Backend verifies authentication
4. Booking service processes request
5. Booking stored in database
6. Response sent back to user

## PlantUML

```
@startuml
actor Student
participant Frontend
participant "Auth Middleware" as Auth
participant "Booking Controller" as Controller
participant "Booking Service" as Service
participant Database as DB

Student -> Frontend: Select resource + time
Frontend -> Controller: POST /api/bookings
Controller -> Auth: verifyToken()
Auth --> Controller: valid user

Controller -> Service: createBooking(data)
Service -> DB: save booking
DB --> Service: success

Service --> Controller: booking created
Controller --> Frontend: success response
Frontend --> Student: booking pending approval
@enduml
```
