from django.contrib import admin
from courseapp.models import Student, Course, select_course, deselect_course

# Register your models here.

class StudentInline(admin.TabularInline):
    model = Student

class StudentAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'stu_id', 'birth_date', 'course',)
    search_fields = ('name',)
    ordering = ["name"]
    actions = [select_course, deselect_course]
    fieldsets = (
        ['Main', {
            'fields': ('name', 'email',),
        }],
        ['Advance', {
            'classes': ('collapse',),
            'fields': ('stu_id', 'birth_date',)# 'course',),
        }]
    )

class CourseAdmin(admin.ModelAdmin):
    inlines = [StudentInline]
    list_display = ('name', 'coordinator', 'max_size', 'current_size',)
    search_fields = ('name',)
    ordering = ["name"]
    fieldsets = (
        ['Main', {
            'fields': ('name', 'coordinator',),
        }],
        ['Advance', {
            'classes': ('collapse',),
            'fields': ('max_size', 'current_size',),
        }]
    )
admin.site.register(Student, StudentAdmin)
admin.site.register(Course, CourseAdmin)