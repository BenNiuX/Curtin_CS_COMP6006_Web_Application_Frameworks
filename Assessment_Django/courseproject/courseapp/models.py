from django.contrib import admin
from django.db import models
import random
from datetime import date

# Create your models here.

COURSE_CP = 0
COURSE_CS = 1
COURSE_SE = 2
COURSE_INDEX_NAME = 0
COURSE_INDEX_COOR = 1
COURSE_MAX_SIZE = 50
NAME_DEFAULT_LEN = 50
STU_ID_DEFAULT_LEN = 10
TOTAL_STUDENT_NUM = 100

COURSE_INFOS_DEFAULT = [
    ("Master of Computing", "Computing coordinator"),
    ("Bachelor of Cyber Security", "Cyber Sec coordinator"),
    ("Bachelor of Software Engineering", "Soft Engi coordinator"),
]

class Course(models.Model):
    name = models.CharField(max_length=NAME_DEFAULT_LEN)
    coordinator = models.CharField(max_length=NAME_DEFAULT_LEN)
    max_size = models.IntegerField(default=COURSE_MAX_SIZE)
    current_size = models.IntegerField(default=0)

    def is_full(self):
        return self.current_size >= self.max_size

    def __str__(self):
        return f"Course info: name={self.name}, coor={self.coordinator}," \
            f" cur_size={self.current_size}, max_size={self.max_size}"

    @classmethod
    def dump_header(cls):
        return ["Name", "Coordinator", "Max size", "Current size"]

    def dump_data(self):
        return [self.name, self.coordinator, self.max_size, self.current_size]

class Student(models.Model):
    name = models.CharField(max_length=NAME_DEFAULT_LEN)
    email = models.EmailField()
    stu_id = models.CharField(max_length=STU_ID_DEFAULT_LEN)
    birth_date = models.DateField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, blank=True, null=True)

    def get_course_info(self):
        if not self.course:
            return ""
        return self.course.name

    def __str__(self):
        return f"Student info: name={self.name}, email={self.email}," \
            f" stu id={self.stu_id}, birth={self.birth_date}," \
            f" course={self.get_course_info()}"

    @classmethod
    def dump_header(cls):
        return ["Name", "Email", "Student ID", "Birthday", "Course"]

    def dump_data(self):
        return [self.name, self.email, self.stu_id, self.birth_date, self.get_course_info()]

def insert_dummy_course_info():
    for course_info in COURSE_INFOS_DEFAULT:
        course_data = Course.objects.create(name=course_info[COURSE_INDEX_NAME],
                                coordinator=course_info[COURSE_INDEX_COOR])
        print(course_data, type(course_data))
    return len(COURSE_INFOS_DEFAULT)

def update_course_student_num():
    courses = Course.objects.all()
    for course_data in courses:
        course_data.current_size = len(Student.objects.filter(course=course_data))
        course_data.save()

def get_random_date():
    try:
        return date(random.randint(1990, 2006),
                    random.randint(1, 12),
                    random.randint(1, 31))
    except ValueError:
        return get_random_date()

def get_random_stuid():
    return f"21{random.randint(100000, 999999)}"

def course_has_space():
    courses = Course.objects.all()
    for course_data in courses:
        if not course_data.is_full():
            return True
    return False

def get_random_course():
    courses = Course.objects.all()
    course_size = len(courses)
    course_id = 0
    course_unavailable = True
    while(course_unavailable):
        course_index = random.randint(0, course_size-1)
        course_data = Course.objects.all()[course_index]
        course_unavailable = course_data.is_full()
        course_id = course_data.pk
    return course_id

@admin.action(description="Select course", permissions=["change"])
def select_course(modeladmin, request, queryset):
    for stu_data in queryset:
        if course_has_space():
            stu_data.course_id = get_random_course()
            stu_data.save()
            update_course_student_num()
        else:
            print("Select course fail")

@admin.action(description="Deselect course", permissions=["change"])
def deselect_course(modeladmin, request, queryset):
    queryset.update(course=None)
    update_course_student_num()

def insert_dummy_student_info():
    cap = len(COURSE_INFOS_DEFAULT) * COURSE_MAX_SIZE
    global TOTAL_STUDENT_NUM
    if TOTAL_STUDENT_NUM > cap:
        TOTAL_STUDENT_NUM = cap
    success_num = 0
    for i in range(TOTAL_STUDENT_NUM):
        if course_has_space():
            student_data = Student.objects.create(name=f"STU_{i+1}_NAME",
                                email=f"stu.name.{i+1}@mail.com",
                                stu_id=get_random_stuid(),
                                birth_date=get_random_date(),
                                course_id=get_random_course())
            print(student_data, type(student_data))
            update_course_student_num()
            success_num += 1
    return success_num

def clear_data():
    Student.objects.all().delete()
    Course.objects.all().delete()

def init_data():
    clear_data()
    ins_course_num = insert_dummy_course_info()
    ins_stu_num = insert_dummy_student_info()
    return f"Insert course num={ins_course_num}, student num={ins_stu_num}"