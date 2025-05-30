import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const TestExamPage = () => {
    const { user, isTeacher, isAdmin } = useAuth();

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1>🎯 Test Exam Management Page</h1>
            
            <div style={{ 
                background: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: '8px', 
                marginBottom: '2rem',
                border: '1px solid #e9ecef'
            }}>
                <h3>User Information:</h3>
                <p><strong>Name:</strong> {user?.fullname || user?.username || 'Unknown'}</p>
                <p><strong>Role:</strong> {user?.role || 'Unknown'}</p>
                <p><strong>Is Teacher:</strong> {isTeacher() ? 'Yes' : 'No'}</p>
                <p><strong>Is Admin:</strong> {isAdmin() ? 'Yes' : 'No'}</p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3>🚀 Navigation Test</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link 
                        to="/" 
                        style={{ 
                            padding: '0.5rem 1rem', 
                            background: '#007bff', 
                            color: 'white', 
                            textDecoration: 'none', 
                            borderRadius: '4px' 
                        }}
                    >
                        Home (Student View)
                    </Link>
                    <Link 
                        to="/exams" 
                        style={{ 
                            padding: '0.5rem 1rem', 
                            background: '#28a745', 
                            color: 'white', 
                            textDecoration: 'none', 
                            borderRadius: '4px' 
                        }}
                    >
                        Teacher Exams
                    </Link>
                    <Link 
                        to="/teacher" 
                        style={{ 
                            padding: '0.5rem 1rem', 
                            background: '#17a2b8', 
                            color: 'white', 
                            textDecoration: 'none', 
                            borderRadius: '4px' 
                        }}
                    >
                        Teacher Dashboard
                    </Link>
                </div>
            </div>

            <div style={{ 
                background: '#d4edda', 
                padding: '1rem', 
                borderRadius: '8px',
                border: '1px solid #c3e6cb'
            }}>
                <h3>✅ Success!</h3>
                <p>If you can see this page, the routing is working correctly!</p>
                <p>Current URL: <code>{window.location.pathname}</code></p>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h3>📋 Next Steps:</h3>
                <ul>
                    <li>✅ Routing setup complete</li>
                    <li>✅ Authentication working</li>
                    <li>🔄 API integration in progress</li>
                    <li>⏳ Full exam management features coming</li>
                </ul>
            </div>
        </div>
    );
};

export default TestExamPage; 