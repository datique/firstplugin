import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Tab extends Component {
    static propTypes = {
        activeTab: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
    };

    onClick = () => {
        const { label, onClick } = this.props;
        onClick(label);
    }

    render() {
        const {
            onClick,
            props: {
                activeTab,
                label,
            },
        } = this;

        let className = 'tab-list-item';

        const tabListItem = {
            display: 'inline-block',
            listStyle: 'none',
            marginBottom: '-1px',
            padding: '0.5rem 0.75rem'
        }

        const tabListActive = {
            display: 'inline-block',
            listStyle: 'none',
            backgroundColor: 'white',
            border: 'solid #ccc',
            borderWidth: '1px 1px 0 1px'

        }

        let style = tabListItem;

        if (activeTab === label) {
            className += ' tab-list-active';
            style = tabListActive;
        }

        return (
            <li style={style}
                className={className}
                onClick={onClick}
            >
                {label}
            </li>
        );
    }
}

export default Tab;