import React, { useState, useEffect } from 'react';
import styles from "./front.module.css";
import Sample from './assets/Sample.png';
import Plus from './assets/+.png';
import Savednote from './components/savedNote';

export default function Front() {
  const [modal, setModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [groups, setGroups] = useState(() => {
    const savedGroups = localStorage.getItem('groups');
    return savedGroups ? JSON.parse(savedGroups) : [];
  });

  const [selectedGroup, setSelectedGroup] = useState(null);

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


  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const handleSubmit = () => {
    if (groupName && selectedColor) {
      setGroups([...groups, { name: groupName, color: selectedColor, noteColor: 'white' }]);
      setGroupName('');
      setSelectedColor('');
      setModal(false);
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const handleNoteClick = (group) => {
    //Check if the clicked group is already selected
    if (selectedGroup && selectedGroup.name === group.name) {
      // Unselect the group
      setSelectedGroup(null);
      const resetGroups = groups.map(g => ({ ...g, noteColor: 'white' }));
      setGroups(resetGroups);
    } else {
      // Select the group
      setSelectedGroup(group);
      const updatedGroups = groups.map(g => 
        g.name === group.name ? { ...g, noteColor: '#2F2F2F2B' } : { ...g, noteColor: 'white' }
      );
      setGroups(updatedGroups);
    }
  };

  const handleTitleClick = () => {
    setSelectedGroup(null);
    const resetGroups = groups.map(g => ({ ...g, noteColor: 'white' }));
    setGroups(resetGroups);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.left} style={{ display: isMobile && selectedGroup ? 'none' : 'block' }}>
          <h1 onClick={handleTitleClick}>Pocket Note</h1>
          <div className={styles.noteList}>
            {groups.map((group, index) => (
              <div 
                key={index} 
                className={styles.note} 
                style={{ height: '10vh', fontSize: '20px', backgroundColor: group.noteColor }} 
                onClick={() => handleNoteClick(group)}
              >
                <span className={styles.initials} style={{ backgroundColor: group.color }}>
                  {getInitials(group.name)}
                </span>
                <span className={styles.groupName}>{group.name}</span>
              </div>
            ))}
          </div>
          <button onClick={toggleModal}><img src={Plus} alt="Plus icon" /></button>
        </div>
        <section className={styles.contentContainer} >
          {selectedGroup ? (
            <Savednote group={selectedGroup} />
          ) : (
            <div className={styles.right}>
              <img src={Sample} alt="Sample" />
              <h1>Pocket Notes</h1>
              <p>
                Send and receive messages without keeping your phone online. <br />
                Use Pocket Notes on up to 4 linked devices and 1 mobile phone
              </p>
            </div>
          )}
        </section>
      </div>
      {modal && (
        <div onClick={toggleModal} className={styles.modalContainer}>
          <div onClick={(e) => e.stopPropagation()} className={styles.popUp}>
            <p>Create New Group</p>
            <label htmlFor="groupName">
              Group Name
              <input 
                type="text" 
                placeholder="Enter Group Name" 
                value={groupName} 
                onChange={(e) => setGroupName(e.target.value)} 
              />
            </label>
            <div className={styles.popUp1}>
              <p>Choose Color</p>
              <div className={styles.selector}>
                {['#B38BFA', '#FF79F2', '#43E6FC', '#F19576', '#0047FF', '#6691FF'].map((color, index) => (
                  <button 
                    key={index} 
                    style={{ backgroundColor: color }} 
                    onClick={() => handleColorSelection(color)}
                  ></button>
                ))}
              </div>
            </div>
            <button onClick={handleSubmit} className={styles.submit}>Create</button>
          </div>
        </div>
      )}
    </>
  );
}
