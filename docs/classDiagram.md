# Class Diagram – CampusFlow

![Class](images/ClassDigram.png)

## Core Classes

* User
* Resource
* Booking
* Complaint

## Service Layer Classes

* AuthService
* BookingService
* ResourceService
* ComplaintService

## Controller Layer

* BookingController
* ResourceController
* ComplaintController

## UML (PlantUML)

```
@startuml

class User {
  id
  name
  email
  password
  role
}

class Resource {
  id
  name
  type
  availability
}

class Booking {
  id
  userId
  resourceId
  status
  startTime
  endTime
}

class Complaint {
  id
  userId
  description
  status
}

class BookingService
class ResourceService
class ComplaintService
class AuthService

class BookingController
class ResourceController
class ComplaintController

User "1" -- "many" Booking
Resource "1" -- "many" Booking
User "1" -- "many" Complaint

BookingController --> BookingService
ResourceController --> ResourceService
ComplaintController --> ComplaintService

BookingService --> Booking
ResourceService --> Resource
ComplaintService --> Complaint
AuthService --> User

@enduml
```
