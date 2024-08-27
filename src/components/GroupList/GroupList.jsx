import React from 'react'
import PropTypes from 'prop-types'
import styles from './GroupList.module.css'
import Group from '../Group'

const GroupList = ({ groups, onSelectGroup }) => {
  return (
    <div className={styles.groupList}>
        {groups.map(group => (
            <Group
            key={group.groupName}
            groupName={group.name}
            onClick={() => onSelectGroup(group.jid)}
            />
        ))}
    </div>
  )
}

GroupList.propTypes = {
    groups: PropTypes.arrayOf(
        PropTypes.shape({
            groupName: PropTypes.string.isRequired,
        })
    ).isRequired,
    onSelectGroup: PropTypes.func.isRequired
}

export default GroupList