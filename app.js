const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");
const dbPath = path.join(__dirname, "app.db");
const app = express();
app.use(express.json());
app.use(cors());
let db = null;

const initlializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3004, () => {
      console.log("app started at localhost 3004");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

app.get("/", async (request, response) => {
  const getStudentDetails = `SELECT * FROM student`;
  const students = await db.all(getStudentDetails);
  response.send(students);
});

app.get("/student/:studentId", async (request, response) => {
  const { studentId } = request.params;
  const getSingleStudent = `SELECT * FROM student WHERE id=${studentId}`;
  const studentResponse = await db.get(getSingleStudent);
  response.send(studentResponse);
});

app.post("/student/", async (request, response) => {
  const studentDetails = request.body;
  const { id, name, age, score } = studentDetails;
  const addingStudent = `
   INSERT INTO student (id,name,age,score)
   VALUES (
      ${id},
      '${name}',
      ${age},
      ${score}
   ) 
  `;
  const dbResponse = await db.run(addingStudent);
  response.send(`${dbResponse.lastID} added successfully`);
});

app.delete("/student/:studentId", async (request, response) => {
  const { studentId } = request.params;
  const deleteStudent = `DELETE from student WHERE id=${studentId}`;
  await db.run(deleteStudent);
  response.send("student deleted successfully");
});

app.put("/student/:studentId", async (request, response) => {
  const { studentId } = request.params;
  const { name,age ,score } = request.body;
  const editStudent = `UPDATE student SET name="${name}",age=${age},score=${score} WHERE id=${studentId}`;
  await db.run(editStudent)
  response.send('successfully updated student')
});

initlializeDbAndServer();
