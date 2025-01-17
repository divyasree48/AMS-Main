import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import bodyParser from "body-parser"; 
import Student from "./student.js";
import Admin from "./admin.js";
import Teacher from "./teacher.js";
import Classs from "./class.js";
import teacher from "./teacher.js";
// import { addListener } from "nodemon";
const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(express.json())

mongoose.connect("")
.then(()=>app.listen(6969))
.then(()=>console.log('connected'))
.catch((err)=>console.log(err))

app.post('/adddata', async (req,res,next)=>{ // adding new data

    const{name,rollno,branch,isPresent,classs}=req.body.formdata
    const student = await Student.findOne({ rollno });
    if(student)return res.json('alr');
    const stud = new Student({
        name,
        rollno,
        branch,
        classs,
        isPresent
    }) 
    try{
        stud.save()
        return res.json('done');
      }catch(err)
      {
        return res.json('err');
      }
})
// app.post('/addlogdata', async (req,res,next)=>{ // adding new data

//   const{name,username,password,con}=req.body.formData
//   const admin = await Admin.findOne({ username });
//   if(admin)return res.status(404).json({ err: 'Student with that roll no already exists in db' });
//   const adm = new Admin({
//       name,
//       username,
//       password
//   }) 
//   try{
//       adm.save()
//   }catch(err)
//   {
//       console.log(err)
//   }
//   return res.send({msg:"inserted",result:adm})
// })
app.post('/addCdata', async (req,res,next)=>{ // adding new data

  const{name,cid,teachers,students,avail}=req.body.formdata
  const clas = await Classs.findOne({ cid });
  if(clas)return res.json('alr');
  const cla = new Classs({
      name,
      cid,
      teachers,
      students,
      avail
  }) 
  try{
      cla.save()
      return res.json('done');
    }catch(err)
    {
      return res.json('err');
    }
})


app.post('/addTdata', async (req,res,next)=>{ // adding new data

  const{name,username,password,tid,classs,avail}=req.body.formdata
  const clas = await Teacher.findOne({ tid });
  if(clas)return res.json('alr');
  const cla = new Teacher({
    name,
    username,
    password,
    tid,
    classs,
    avail
  }) 
  try{
      cla.save()
      return res.json('done');
  }catch(err)
  {
    return res.json('err');
  }
})


app.post('/admlogin', async (req,res,next)=>{ // adding new data

    const{username,password}=req.body.userData
    const admin = await Admin.findOne({ username });
    if(!admin)return res.json('not');
    try{
        if(admin.password == password)return res.json('succ');
        else return res.json('inv');
    }catch(err)
    {
        console.log(err)
    }
    return res.status(404).json({ err: 'internal error' });
})


app.post('/teachlogin', async (req,res,next)=>{ // adding new data

  const{username,password}=req.body.userData
  const teacher = await Teacher.findOne({ username });
  if(!teacher)return res.json('not');
  try{
      if(teacher.password == password)return res.json('succ');
      else return res.json('inv');
  }catch(err)
  {
      console.log(err)
  }
  return res.status(404).json({ err: 'internal error' });
})


app.put('/present/:rollno', async (req, res) => {
    const rollno = req.params.rollno;
    try {
        const student = await Student.findOne({ rollno });
        if (!student) {
          return res.status(404).json({ err: 'Student not found in database' });
        }
        if(student.isPresent)
        return res.status(404).json({ err: 'duplicated punch' });
        else
        student.isPresent = true;

        await student.save();
        res.json(student);
      } catch (error) {
        console.error(error);
        res.status(500).json({ err: 'Internal Server Error' });
      }
});

app.put('/getTdata/:id', async (req, res) => {
  const tid = req.params.id;
  try {
      const teach = await Teacher.findOne({ tid });
      if (!teach) {
        return res.send('err');
      }
        return res.send(teach);
    }
      catch(err){
        return res.send('err')
      }
});
app.put('/teacherid/:id', async (req, res) => {
  const username = req.params.id;
  try {
      const teach = await Teacher.findOne({ username:username });
      if (!teach) {
        return res.send('err');
      }
        return res.send(teach);
    }
      catch(err){
        return res.send('err')
      }
});
app.put('/getstudents/:tid', async (req, res) => {
  const teachers = req.params.tid;
  try {
      const cls = await Classs.findOne({ teachers });
      if (!cls) {
        return res.send('err');
      }
        return res.send(cls.students);
    }
      catch(err){
        return res.send('err')
      }
});
app.put('/clearteacher/:tid', async (req, res) => {
  const teachers = req.params.tid;
  try {
      const cls = await Classs.findOne({ teachers });
      if (!cls) {
        return res.send('err');
      }
      cls.teachers = '';
      cls.avail = true;
      cls.save();
    }
      catch(err){
        return res.send('err')
      }
});
app.put('/clearclass/:name', async (req, res) => {
  const name = req.params.name;
  try {
      const cls = await Teacher.findOne({ name });
      if (!cls) {
        return res.send('err');
      }
      cls.classs = '';
      cls.avail = true;
      cls.save();
    }
      catch(err){
        return res.send('err')
      }
});
app.put('/getdata1/:rollno', async (req, res) => {
  const rollno = req.params.rollno;
  try {
      const roll = await Student.findOne({ rollno });
      if (!roll) {
        return res.send('err');
      }
        return res.json(roll);
    }
      catch(err){
        return res.send('err')
      }
});
app.post('/addTtoC', async (req, res) => {
  const{name,username,password,tid,classs} = req.body.formdata; // tid class
  try {
      const clas = await Classs.findOne({ name:classs });
      if (!clas) {
        return res.json('notfound');
      }
      clas.teachers = (tid);
      clas.avail = false;
      await clas.save();
      return res.json('done');
    } catch (error) {
      return res.json('error in addt');
    }
});
app.post('/addCtoT', async (req, res) => {
  const{tid,classs} = req.body.data; // tid class
  try {
      const teach = await Teacher.findOne({ tid:tid });
      if (!teach) {
        return res.json('notfound');
      }
      teach.classs = classs;
      await teach.save();
      return res.json('done');
    } catch (error) {
      return res.json('error in addt');
    }
});

app.post('/addStoC', async (req, res) => {
  const{name,rollno,branch,isPresent,classs} = req.body.formdata;
  console.log(rollno)
  try {
      const clas = await Classs.findOne({ name:classs });
      if (!clas) {
        return res.json('notfound');
      }
      clas.students.push(rollno)
      await clas.save();
      return res.json('done');
    } catch (error) {
      return res.json('error');
    }
});

app.get('/getdata',async (req,res,next)=>{
  //  res.send("success");
  let data;
  try{
     data=await Student.find();
      console.log(data)
  }
  catch(err){
     console.log(msg);
  }
  if(!data) console.log("no data found");
  return res.status(200).json({data})
})


app.get('/getCdata',async (req,res,next)=>{
  //  res.send("success");
  let data;
  try{
      data=await Classs.find();
      return !data?res.send('err'):res.send(data);
  }
  catch(err){
    return res.send('err');
  }
})

app.get('/getTdata',async (req,res,next)=>{
  //  res.send("success");
  let data;
  try{
      data=await Teacher.find();
      return !data?res.send('err'):res.send(data);
  }
  catch(err){
    return res.send('err');
  }
})

app.delete('/deleteT/:id', async (req, res, next)=>{
  const _id = req.params.id
  let teach;
  try{
      teach= await Teacher.findByIdAndDelete({_id});
      res.json('success')
  }catch(err){
      return res.json('err')
  }
  if(!teach){
    return res.json('err')
  }
})
app.delete('/deleteC/:id', async (req, res, next)=>{
  const _id = req.params.id
  let teach;
  try{
      teach= await Classs.findByIdAndDelete({_id});
      res.json('success')
  }catch(err){
      return res.json('err')
  }
  if(!teach){
    return res.json('err')
  }
})
app.put('/toggle/:rollno', async (req, res) => {
  const rollno = req.params.rollno;
  try {
      const student = await Student.findOne({ rollno });
      if (!student) {
        return res.status(404).json({ err: 'Student not found in database' });
      }
      student.isPresent = !student.isPresent;
      await student.save();
      res.json(student);
    } catch (error) {
      console.error(error);
      res.status(500).json({ err: 'Internal Server Error' });
    }
});

app.delete('/delete/:id', async (req, res, next)=>{
  const _id = req.params.id
  let studentdata;
  try{
      studentdata= await Student.findByIdAndDelete(_id);
      return res.json('success')
  }catch(err){
      return res.json('err')
  }
  if(!studentdata){
    return res.json('err')
  }
})


// get , post, put
// app.use('/',(req,res,next)=>{
//     res.send("hellow")
// }).listen(6969)



// resume from creating add daa
