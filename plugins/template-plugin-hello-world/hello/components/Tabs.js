import React, { Component } from 'react';
import PropTypes from 'prop-types';
//require("../css/Tabs.css");
import Tab from './Tab';



class Tabs extends Component {
    static propTypes = {
        children: PropTypes.instanceOf(Array).isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            activeTab: this.props.children[0].props.label,
        };
    }

    onClickTabItem = (tab) => {
        this.setState({ activeTab: tab });
    }



    render() {
        const {
            onClickTabItem,
            props: {
                children,
            },
            state: {
                activeTab,
            }
        } = this;

        return (
            <div style={{ padding: '16px', border: '1px #e8e8e8 solid', borderRadius: '3px' }}>
                <div className="tabs" style={{ height: '300px', overflow: 'scroll' }}>
                    <ol style={{ borderBottom: '1px solid #ccc', paddingLeft: '0', listStyle: 'none' }}>
                        {children.map((child) => {
                            const { label } = child.props;

                            return (
                                <Tab
                                    activeTab={activeTab}
                                    key={label}
                                    label={label}
                                    onClick={onClickTabItem}
                                />
                            );
                        })}
                    </ol>
                    <div className="tab-content">
                        {children.map((child) => {
                            if (child.props.label !== activeTab) return undefined;
                            return child.props.children;
                        })}
                    </div>
                </div >
            </div>
        );
    }
}

/*
const tab_list = {
    borderBottom: '1px solid #ccc',
    paddingLeft: '0'
};

const tab_list_item = {
    display: 'inline-block',
    listStyle: 'none',
    marginBottom: '-1px',
    padding: '0.5rem 0.75rem'
};

const tab_list_active = {
    backgroundColor: 'white',
    border: 'solid #ccc',
    borderWidth: '1px 1px 0 1px'
};
*/

export default Tabs;
