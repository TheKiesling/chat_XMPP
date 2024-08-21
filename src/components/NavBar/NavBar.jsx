import React from 'react';
import PropTypes from 'prop-types';
import styles from './Navbar.module.css';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ForumIcon from '@mui/icons-material/Forum';

const Navbar = ({ onForumSelect, onUserSelect }) => {
  return (
    <div className={styles.navBar}>
        <div className={styles.icon} onClick={onForumSelect} ><ForumIcon /></div>
        <div className={styles.icon} onClick={onUserSelect}> <PersonAddIcon /></div>
    </div>
  );
};

Navbar.propTypes = {
  onForumSelect: PropTypes.func.isRequired,
  onUserSelect: PropTypes.func.isRequired,
};

export default Navbar;