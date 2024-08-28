import React from 'react';
import PropTypes from 'prop-types';
import styles from './Navbar.module.css';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ForumIcon from '@mui/icons-material/Forum';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupsIcon from '@mui/icons-material/Groups';

const Navbar = ({ onForumSelect, onUserSelect, onConfigurationSelect, onGroupSelect }) => {
  return (
    <div className={styles.navBar}>
        <div className={styles.icon} onClick={onForumSelect} ><ForumIcon /></div>
        <div className={styles.icon} onClick={onUserSelect}> <PersonAddIcon /></div>
        <div className={styles.icon} onClick={onGroupSelect}> <GroupsIcon /></div>
        <div className={styles.icon} onClick={onConfigurationSelect}> <SettingsIcon /></div>
    </div>
  );
};

Navbar.propTypes = {
  onForumSelect: PropTypes.func.isRequired,
  onUserSelect: PropTypes.func.isRequired,
  onConfigurationSelect: PropTypes.func.isRequired,
  onGroupSelect: PropTypes.func.isRequired
};

export default Navbar;