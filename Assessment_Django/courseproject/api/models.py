from django.db import models
from tastypie.resources import ModelResource
from courseapp.models import Student, Course

# Create your models here.
class CourseResource(ModelResource):
    class Meta:
        # excludes = ["id"]
        queryset = Course.objects.all()
        resource_name = 'courses'

class StudentResource(ModelResource):
    class Meta:
        # excludes = ["id"]
        queryset = Student.objects.all()
        resource_name = 'students'