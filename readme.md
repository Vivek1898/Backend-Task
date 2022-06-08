- **Tech-stack**

---

`Node.js`
`Express.js`
`MongoDb`
`JavaScript`
--------------------------------------------------------------------------------------------------------------
- **Implemenation of the REST API**

- **POST** 
 ```sh
- Only POST Items with unique Id
- all fields are mandatory else it returns Field not found

raw-form data

uid:1
name:name
tagline:Tagline
schedule:25-05-2002
desc:description
moderator:Admin
category:events
sub_category:dancing
rigor_rank:458
attendees:A
type:event
myImage:"upload it"

http://localhost:8000/api/v3/app/events
```
 - **GET**

 ```sh
 PAGINATION
http://localhost:8000/api/v3/app/events?type=latest&limit=5&page=1

here type-> get event by latest created date
```
------------------------------------------------------------------------------------------------------------------

 - **GET**
```sh
BY UNIQUE ID

-> If Id is present in Database then it returns item else Failure

http://localhost:8000/api/v3/app/events?id=25811
```

--------------------------------------------------------------------------------------------------------------
- **DELETE**
```sh
- If Id is present in Database then it returns item else Failure

 http://localhost:8000/api/v3/app/events/:id
```
--------------------------------------------------------------------------------------------------------------

- **PUT** 
 ```sh
 
- If Id is present in Database then it returns item else Failure

http://localhost:8000/api/v3/app/events/:id

```
- **Task2**

<a href="https://docs.google.com/spreadsheets/d/1ZjAdDnW03DFNgeEBC4F-OXbLjwqfzcaJcaoxcBRGuE0/edit?usp=sharing ">Link</a>


