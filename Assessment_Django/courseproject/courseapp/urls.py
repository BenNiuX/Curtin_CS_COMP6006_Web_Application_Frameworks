from django.urls import path

from . import views

urlpatterns = [
    path('', views.welcome),
    path('init_data/', views.init_data),
    path('student_list/', views.student_list),
    path('course_list/', views.course_list),
    path('course_detail/<int:course_id>', views.course_detail),
]