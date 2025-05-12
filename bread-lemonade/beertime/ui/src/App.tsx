import React, { useRef } from 'react';
import MyCalendar from "./calendar";
import Header from './header';
import ApplyForm from './apply-form';
import { Col } from 'react-grid-system';
import MediaQuery, { useMediaQuery } from 'react-responsive';
import { InputRef } from 'antd';
import type { BaseSelectRef } from 'rc-select';
import dayjs, { Dayjs } from 'dayjs';

const socket = new WebSocket("ws://backend.default:8080")

type ViewProps = {
    nameRef: React.RefObject<InputRef>
    placeRef: React.RefObject<BaseSelectRef>
    calendarRef: React.RefObject<{v: Dayjs}>
};

const ColView: React.FC<ViewProps> = ({ nameRef, placeRef, calendarRef }) => {
    return (
        <div id="content-col">
            <MyCalendar socket={socket} calendarRef={calendarRef} />
            <ApplyForm socket={socket} nameRef={nameRef} placeRef={placeRef} calendarRef={calendarRef}/>
        </div>
    );
};

const RowView: React.FC<ViewProps> = ({ nameRef, placeRef, calendarRef }) => {
    return (
        <div id="content-row">
            <MyCalendar socket={socket} calendarRef={calendarRef} />
            <ApplyForm socket={socket} nameRef={nameRef} placeRef={placeRef} calendarRef={calendarRef}/>
        </div>
    );
};
const App = () => {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 1224px)'
    }, undefined, (_) => {
        // request data from socket
    });
    const nameRef: React.RefObject<InputRef> = useRef(null);
    const placeRef: React.RefObject<BaseSelectRef> = useRef(null);
    const calendarRef = useRef({v: dayjs()});
    return (
        <Col style={{ margin: 0 }}>
            <Header title="Some beer?" />
            {isTabletOrMobile && <ColView nameRef={nameRef} placeRef={placeRef} calendarRef={calendarRef} />}
            {isDesktopOrLaptop && <RowView nameRef={nameRef} placeRef={placeRef} calendarRef={calendarRef} />}
        </Col>
    );
};
export default App;