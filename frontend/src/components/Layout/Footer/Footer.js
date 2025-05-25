import React from 'react';
import './Footer.css'
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Test4U</h3>
          <p>Nền tảng thi trực tuyến hàng đầu, hỗ trợ học tập và đánh giá hiệu quả.</p>
        </div>  
        <div className="footer-section">
          <h4>Liên hệ</h4>
          <p>Email: support@test4u.com</p>
          <p>Hotline: 0123 456 789</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Test4U. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;