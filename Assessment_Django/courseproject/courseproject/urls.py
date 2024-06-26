"""
URL configuration for courseproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from courseapp import views
from api.models import CourseResource, StudentResource

course_resource = CourseResource()
student_resource = StudentResource()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include("courseapp.urls")),
    path('course_management/', views.welcome),
    path('api/', include(course_resource.urls)),
    path('api/', include(student_resource.urls)),
]
