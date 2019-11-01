# Exam Cell Automation
This Project was made in order to automate the process of Exam Cell Management.We have developed a website which is a smaller
scale version of SPPU Exam CELL.The webiste currently serves 5 Engineering Colleges each having 3 departments (COMP,ENTC,IT).
The project deals with the registration of students,generation of automated Exam Forms,generation of HallTicket and Results for 
the students which can be accessed remotely. This website allows the admin to enter the results of the students 
and editing of timetable.

## Technology Stack Used
### Backend
- Nodejs
- MongoDB
### Frontend
- HTML
- CSS
- Bootstrap
- Javascript

## Modules
1. Timetable
  - The admin can add the table for each and every semester on the link provided in admin panel.
    On the client side each student can view the timetable of each semester.
2. Result
  - The admin can add result of the each semester for every student.
    On the client side the student can view the result on the link provided on dashboard.
3. Examform and Hallticket
  - Student will be able to fill the exam form when the link for exam form will be generated by admin for current semester.
    After filling the exam form Hall ticket will be generated and can be printed by students.

## Running the webiste on a local server
   1. **Start the server** 
   ```
   node server.js
   ```
   In the browser put the url - localhost:3000/examdash to access the website
   
   2. Client side
      1. When the website will be accessed ,students will see a exam cell dashboard containing links to register,login,results,notice
      2. Register
        - The student can register only once through their SPPU eligibility number.
      3. Home Page
        - Once logged in the student can visit timetable,result,examform,notice,syllabus pages by the links provided in navigation 
          panel.
   3. Admin Side
      1. Add Timetable
        - The admin can add timetable of each semester for every department by visiting the link timetable in admin panel.
      2. Add Result
        - The admin can add result of the each semester for every student , by visiting the link result in admin panel.
## Thank You