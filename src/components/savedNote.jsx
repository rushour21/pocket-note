import React, { useState, useEffect } from 'react';
import styles from '../styles/savedNote.module.css';
import vector from '../assets/Vector.png';
import { ArrowLeft } from 'lucide-react';

export default function Savednote({ group }) {
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const [data, setData] = useState('');
  const [dataList, setDataList] = useState([]);

  // Load initial data from localStorage when component mounts
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(group.name)) || [];
    setDataList(savedData);
  }, [group.name]);

  const handlesave = () => {
    if (!data.trim()) return;
    const timestamp = new Date();
    const newNote = { text: data, timestamp: timestamp.toISOString() }; // Store text and timestamp
    const updatedDataList = [...dataList, newNote]; // Add new note object to the list
    localStorage.setItem(group.name, JSON.stringify(updatedDataList)); // Save updated list to localStorage
    setDataList(updatedDataList); // Update state to reflect the new list
    setData(''); // Clear the input field
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleDateString('en-GB', options).replace(',', ' •');
  };

const [isMobile, setIsMobile] = useState(false);  // New state to track mobile view

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);  // Detect mobile screen width
      } else {
        setIsMobile(false);  // Reset if it's not mobile
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();  // Initial check on component mount

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.noteContainer}>
      <div className={styles.header}>
        <span onClick={() => window.location.reload()} style={{ display: isMobile ? 'block' : 'none' }}><ArrowLeft /></span>
        <span className={styles.titleInitials} style={{ backgroundColor: group.color }}>
          {group ? getInitials(group.name) : ''}
        </span>
        <span className={styles.titleName}>{group ? group.name : ''}</span>
      </div>
      <div className={styles.noteArea}>
        {dataList.map((item, index) => (
          <div key={index} className={styles.noteItem}>
            <p>{item.text}</p>
            <div className={styles.timestamp}>{formatDate(item.timestamp)}</div>
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        <textarea
          className={styles.type}
          placeholder='Enter your text here...........'
          value={data}
          onChange={(e) => setData(e.target.value)}
        ></textarea>
        <img onClick={handlesave} className={styles.vector} src={vector} alt="Vector icon" />
      </div>
    </div>
  );
}
