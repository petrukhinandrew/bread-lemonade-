import React from 'react';

type HeaderProps = {
    title: string
}
const Header: React.FC<HeaderProps> = ({ title }) => {
    const headerStyle: React.CSSProperties = {
        margin: 0,
        display: 'flex',
        width: '100%',
        height: '10vh',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: "start",
        fontSize: 64,
        color: "white",
        backgroundColor: "#AD8551"
    };
    return (<div style={headerStyle} className='force-font'>
        {title}
    </div>);
};

export default Header;