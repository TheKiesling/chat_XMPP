import React from 'react';
import PropTypes from 'prop-types';
import styles from './NavBar.module.css';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ForumIcon from '@mui/icons-material/Forum';

const NavBar = ({ onForumSelect, onUserSelect }) => {
  return (
    <div className={styles.navBar}>
        <div className={styles.icon} onClick={onForumSelect} ><ForumIcon /></div>
        <div className={styles.icon} onClick={onUserSelect}> <PersonAddIcon /></div>
    </div>
  );
};

NavBar.propTypes = {
  onForumSelect: PropTypes.func.isRequired,
};

export default NavBar;