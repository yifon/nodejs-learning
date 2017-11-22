var student=require('./student');
var teacher=require('./teacher');
//teacher.add('');

function add(teacherName,students){
    teacher.add(teacherName);
    //学生是一个数组，一个班级有多个学生
    students.forEach(function(item,index){
        student.add(item);
    })
    
}
exports.add=add;
//module.exports=add;
