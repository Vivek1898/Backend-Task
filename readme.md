--------------------------------------------------------------------------------------------------------------
POST  
-> Only POST Items with unique Id
-> all fields are mandatory else it returns Field not found

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

--------------------------------------------------------------------------------------------------------------

GET (PAGINATION) -> http://localhost:8000/api/v3/app/events?type=latest&limit=5&page=1

------------------------------------------------------------------------------------------------------------------

GET (BY UNIQUE ID) 
-> If Id is present in Database then it returns item else Failure
http://localhost:8000/api/v3/app/events?id=25811

--------------------------------------------------------------------------------------------------------------

DELETE 
->  If Id is present in Database then it returns item else Failure
 http://localhost:8000/api/v3/app/events/8527

--------------------------------------------------------------------------------------------------------------

PUT 
-> If Id is present in Database then it returns item else Failure
http://localhost:8000/api/v3/app/events/8527
