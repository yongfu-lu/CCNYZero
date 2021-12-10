# CCNYZero
This is a simulated graduated school program tracking system. 

Inorder to run this system, you will need to install node.js and all the dependencies.

To run on local server, enter command: node app.js 

This system is host on heroku as well: https://ccnyzero.herokuapp.com


# System Instruction: 
1. This system has four periods, class setup, class registration, class running and grading period. Admin can change date of today and date of each period to switch from one period to another.
2. Any one can apply to be a student or instructor of the program. The application will be sent to admin. Admin will decide if the applicaion is approved.
3. If a new student or new instructor is accepted. They will received an email contains their CCNY account and password.
4. When a new student login, there will be a tutorial showing how to use the system.
5. A student can register classes during class registration period. Dropping a class during class registration won't have any effect. 
6. Droping a class during class running period will receive a grade of W. Dropping all the classes during class running period will be suspended.
7. A student can apply for graduation, the requirement for graduation is completing 8 courses.
8. An instructor can assign grade to student during grading period. 
9. An instructor will receive warning if instructor did not grade all student when grading period ends. An instructor will received warning if class grade is too high or too low.
10. A student fail same class twice will be terminated. A student with GPA lower than 2 will be terminated.
11. A student or instructor can complaint about other students or instructors. Admin will received the complaint and take actions.
12. Admin can see all the students, instructors and classes details and suspended and un-suspended user.
13. Admin can setup class during class setup period.
