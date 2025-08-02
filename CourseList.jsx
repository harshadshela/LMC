import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: ''
  });

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get('http://localhost:5000/api/courses');
    setCourses(res.data);
  };

  const fetchEnrollments = async () => {
    const res = await axios.get('http://localhost:5000/api/enrollments/me');
    const ids = res.data.map(enroll => enroll._id || enroll.courseId._id);
    setEnrolledCourseIds(ids);
  };

  const enroll = async (courseId) => {
    try {
      await axios.post('http://localhost:5000/api/enrollments', { courseId });
      fetchEnrollments();
    } catch (err) {
      alert('Already enrolled or error occurred');
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/courses', newCourse);
      fetchCourses();
      setShowForm(false);
      setNewCourse({ title: '', description: '', instructor: '', duration: '' });
    } catch (err) {
      alert('Error adding course');
    }
  };

  return (
    <div style={{ backgroundColor: 'yello', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        <h2 className="text-center text-primary fw-bold mb-4">🎓 Course Catalog</h2>

        {/* Add Course Button */}
        <div className="text-center mb-4">
          <button className="btn btn-outline-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Course'}
          </button>
        </div>

        {/* Add Course Form */}
        {showForm && (
          <form className="bg-white p-4 rounded shadow mb-5" onSubmit={handleAddCourse}>
            <div className="mb-3">
              <input type="text" className="form-control" placeholder=" Title"
                value={newCourse.title}
                onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                required />
            </div>
            <div className="mb-3">
              <textarea className="form-control" placeholder="Description"
                value={newCourse.description}
                onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                required />
            </div>
            <div className="mb-3">
              <input type="text" className="form-control" placeholder="Instructor"
                value={newCourse.instructor}
                onChange={e => setNewCourse({ ...newCourse, instructor: e.target.value })}
                required />
            </div>
            <div className="mb-3">
              <input type="text" className="form-control" placeholder="Duration (e.g., 6 weeks)"
                value={newCourse.duration}
                onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })}
                required />
            </div>
            <button type="submit" className="btn btn-success w-100">Submit Course</button>
          </form>
        )}

        {/* Course Cards */}
        <div className="row">
          {courses.map(course => (
            <div className="col-md-6 col-lg-4 mb-4" key={course._id}>
              <div className="card shadow-sm h-100 border-0 rounded-4">
                <div className="card-body">

                <p><strong>📘 Title:</strong> {course.title}</p>
                <p><strong>📝 Description:</strong> {course.description}</p>
                <p><strong>👨‍🏫 Instructor:</strong> {course.instructor}</p>
                <p><strong>⏳ Duration:</strong> {course.duration}</p>
              </div>
                <div className="card-footer bg-transparent border-0 text-center">
                  {enrolledCourseIds.includes(course._id) ? (
                    <button className="btn btn-outline-success w-100" disabled>Enrolled</button>
                  ) : (
                    <button className="btn btn-primary w-100" onClick={() => enroll(course._id)}>🚀 Enroll</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    
  );
}
