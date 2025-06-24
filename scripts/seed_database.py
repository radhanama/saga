#!/usr/bin/env python3
"""Populate the database with test data from CSV files."""
import csv
import os
import uuid
from datetime import datetime

import psycopg2
import bcrypt

# Database configuration from environment variables or defaults
DB_HOST = os.getenv("POSTGRES_SERVER", os.getenv("PostgresServer", "localhost"))
DB_PORT = os.getenv("POSTGRES_PORT", os.getenv("postgresPort", "3452"))
DB_NAME = os.getenv("POSTGRES_DB", os.getenv("PostgresDb", "saga"))
DB_USER = os.getenv("POSTGRES_USER", os.getenv("PostgresUser", "postgres"))
DB_PASS = os.getenv("POSTGRES_PASSWORD", os.getenv("PostgresPassword", "password"))

def connect():
    return psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASS)

def load_csv(path):
    with open(path, newline='', encoding='utf-8') as fh:
        return list(csv.DictReader(fh))

def seed_users(cur, csv_path, email_to_id):
    rows = load_csv(csv_path)
    for row in rows:
        uid = str(uuid.uuid4())
        password_hash = bcrypt.hashpw(row['password'].encode(), bcrypt.gensalt()).decode()
        cur.execute(
            'INSERT INTO "Users" ("Id","FirstName","LastName","Cpf","Email","PasswordHash","Role","CreatedAt","IsDeleted") '
            'VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)',
            (
                uid,
                row['first_name'],
                row['last_name'],
                row['cpf'],
                row['email'].lower(),
                password_hash,
                int(row['role']),
                datetime.utcnow(),
                False,
            ),
        )
        email_to_id[row['email'].lower()] = uid

def seed_research_lines(cur, csv_path, rl_to_id):
    rows = load_csv(csv_path)
    for row in rows:
        rid = str(uuid.uuid4())
        cur.execute(
            'INSERT INTO "ResearchLines" ("Id","Name","Status","IsDeleted") VALUES (%s,%s,%s,%s)',
            (rid, row['name'], row['status'], False),
        )
        rl_to_id[row['name']] = rid

def seed_projects(cur, csv_path, rl_to_id, proj_to_id):
    rows = load_csv(csv_path)
    for row in rows:
        pid = str(uuid.uuid4())
        rlid = rl_to_id.get(row['research_line'])
        if rlid is None:
            continue
        cur.execute(
            'INSERT INTO "Projects" ("Id","ResearchLineId","Name","Status","IsDeleted") VALUES (%s,%s,%s,%s,%s)',
            (pid, rlid, row['name'], int(row['status']), False),
        )
        proj_to_id[row['name']] = pid

def seed_courses(cur, csv_path, course_to_id):
    rows = load_csv(csv_path)
    for row in rows:
        cid = str(uuid.uuid4())
        cur.execute(
            'INSERT INTO "Courses" ("Id","Name","CourseUnique","Credits","Code","IsElective","Concept","IsDeleted") '
            'VALUES (%s,%s,%s,%s,%s,%s,%s,%s)',
            (
                cid,
                row['name'],
                row['course_unique'],
                int(row['credits']),
                row['code'],
                row['is_elective'].lower() == 'true',
                row['concept'],
                False,
            ),
        )
        course_to_id[row['course_unique']] = cid

def seed_professors(cur, csv_path, email_to_id, prof_to_id):
    rows = load_csv(csv_path)
    for row in rows:
        uid = email_to_id.get(row['user_email'].lower())
        if uid is None:
            continue
        pid = str(uuid.uuid4())
        cur.execute(
            'INSERT INTO "Professors" ("Id","UserId","Siape","IsDeleted") VALUES (%s,%s,%s,%s)',
            (pid, uid, row['siape'], False),
        )
        prof_to_id[row['user_email'].lower()] = pid

def seed_external_researchers(cur, csv_path, email_to_id, ext_to_id):
    rows = load_csv(csv_path)
    for row in rows:
        uid = email_to_id.get(row['user_email'].lower())
        if uid is None:
            continue
        xid = str(uuid.uuid4())
        cur.execute(
            'INSERT INTO "ExternalResearchers" ("Id","UserId","Institution","IsDeleted") VALUES (%s,%s,%s,%s)',
            (xid, uid, row['institution'], False),
        )
        ext_to_id[row['user_email'].lower()] = xid

def seed_students(cur, csv_path, email_to_id, proj_to_id, student_to_id):
    rows = load_csv(csv_path)
    for row in rows:
        uid = email_to_id.get(row['user_email'].lower())
        proj = proj_to_id.get(row['project_name'])
        if uid is None or proj is None:
            continue
        sid = str(uuid.uuid4())
        cur.execute(
            'INSERT INTO "Students" ("Id","UserId","Registration","RegistrationDate","ProjectId","Status","EntryDate","Proficiency","InstitutionType","GraduationYear","UndergraduateArea","Scholarship","Gender","IsDeleted") '
            'VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)',
            (
                sid,
                uid,
                row['registration'],
                None,
                proj,
                int(row['status']),
                datetime.utcnow(),
                False,
                1,
                2024,
                1,
                1,
                int(row['gender']),
                False,
            ),
        )
        student_to_id[row['registration']] = sid

def seed_professor_projects(cur, csv_path, prof_to_id, proj_to_id):
    rows = load_csv(csv_path)
    for row in rows:
        prof = prof_to_id.get(row['professor_email'].lower())
        proj = proj_to_id.get(row['project_name'])
        if prof is None or proj is None:
            continue
        ppid = str(uuid.uuid4())
        cur.execute(
            'INSERT INTO "ProfessorProjects" ("Id","ProfessorId","ProjectId","IsDeleted") VALUES (%s,%s,%s,%s)',
            (ppid, prof, proj, False),
        )

def seed_orientations(cur, csv_path, student_to_id, prof_to_id, proj_to_id, email_to_id):
    rows = load_csv(csv_path)
    for row in rows:
        student = student_to_id.get(row['student_registration'])
        professor = prof_to_id.get(row['professor_email'].lower())
        project = proj_to_id.get(row['project_name'])
        coor = email_to_id.get(row['coorientator_email'].lower()) if row.get('coorientator_email') else None
        if None in (student, professor, project):
            continue
        oid = str(uuid.uuid4())
        cur.execute(
            'INSERT INTO "Orientations" ("Id","CoorientatorId","StudentId","Dissertation","ProjectId","ProfessorId","IsDeleted") '
            'VALUES (%s,%s,%s,%s,%s,%s,%s)',
            (oid, coor, student, row['dissertation'], project, professor, False),
        )

def seed_student_courses(cur, csv_path, student_to_id, course_to_id):
    rows = load_csv(csv_path)
    for row in rows:
        student = student_to_id.get(row['student_registration'])
        course = course_to_id.get(row['course_unique'])
        if student is None or course is None:
            continue
        scid = str(uuid.uuid4())
        cur.execute(
            'INSERT INTO "StudentCourses" ("Id","StudentId","CourseId","Grade","Year","Trimester","Status","IsDeleted") '
            'VALUES (%s,%s,%s,%s,%s,%s,%s,%s)',
            (scid, student, course, row['grade'], int(row['year']), int(row['trimester']), int(row['status']), False),
        )

def seed_extensions(cur, csv_path, student_to_id):
    rows = load_csv(csv_path)
    for row in rows:
        student = student_to_id.get(row['student_registration'])
        if student is None:
            continue
        exid = str(uuid.uuid4())
        cur.execute(
            'INSERT INTO "Extensions" ("Id","StudentId","NumberOfDays","Status","Type","IsDeleted") VALUES (%s,%s,%s,%s,%s,%s)',
            (exid, student, int(row['number_of_days']), row['status'], int(row['type']), False),
        )

def main():
    conn = connect()
    conn.autocommit = True
    cur = conn.cursor()
    email_to_id = {}
    rl_to_id = {}
    proj_to_id = {}
    course_to_id = {}
    prof_to_id = {}
    ext_to_id = {}
    student_to_id = {}

    base = os.path.join(os.path.dirname(__file__), 'data')

    seed_users(cur, os.path.join(base, 'users.csv'), email_to_id)
    seed_research_lines(cur, os.path.join(base, 'research_lines.csv'), rl_to_id)
    seed_projects(cur, os.path.join(base, 'projects.csv'), rl_to_id, proj_to_id)
    seed_courses(cur, os.path.join(base, 'courses.csv'), course_to_id)
    seed_professors(cur, os.path.join(base, 'professors.csv'), email_to_id, prof_to_id)
    seed_external_researchers(cur, os.path.join(base, 'external_researchers.csv'), email_to_id, ext_to_id)
    seed_students(cur, os.path.join(base, 'students.csv'), email_to_id, proj_to_id, student_to_id)
    seed_professor_projects(cur, os.path.join(base, 'professor_projects.csv'), prof_to_id, proj_to_id)
    seed_orientations(cur, os.path.join(base, 'orientations.csv'), student_to_id, prof_to_id, proj_to_id, email_to_id)
    seed_student_courses(cur, os.path.join(base, 'student_courses.csv'), student_to_id, course_to_id)
    seed_extensions(cur, os.path.join(base, 'extensions.csv'), student_to_id)

    cur.close()
    conn.close()
    print('Database populated with sample data.')

if __name__ == '__main__':
    main()
