from django.shortcuts import render, HttpResponse, get_object_or_404
from courseapp import models

# Create your views here.

def welcome(request):
    return render(request, 'welcome.html')

def init_data(request):
    response = models.init_data()
    return HttpResponse(f"{init_data.__name__}: {response}")

def student_list(request):
    students = models.Student.objects.all()
    data = {"table_header": models.Student.dump_header()}
    row_data = []
    data["rows"] = row_data
    data["total_number"] = len(students)
    data["unenroll_number"] = len(models.Student.objects.filter(course=None))
    for student_data in students:
        row = student_data.dump_data()
        row_data.append(row)
    return render(request, 'student_list.html', data)

def course_list(request):
    courses = models.Course.objects.all()
    data = {"table_header": models.Course.dump_header()}
    row_data = []
    data["rows"] = row_data
    for course_data in courses:
        row = course_data.dump_data()
        row_data.append(row)
    return render(request, 'course_list.html', data)

def course_detail(request, course_id):
    data = {}
    courses = models.Course.objects.all()
    if course_id >= 0 and course_id < len(courses):
        course_data = courses[course_id]
    else:
        course_data = get_object_or_404(models.Course, id=course_id)
    data["course_header"] = models.Course.dump_header()
    data["course_row"] = course_data.dump_data()
    data["student_header"] = models.Student.dump_header()
    students = models.Student.objects.filter(course=course_data)
    row_data = []
    data["student_rows"] = row_data
    for student_data in students:
        row_data.append(student_data.dump_data)
    return render(request, 'course_detail.html', data)
