import React, { useRef } from 'react';
import type {BaseSelectRef} from 'rc-select';
import { Input, Button, AutoComplete, Image, Col, Row, AutoCompleteProps, InputRef } from 'antd';
import { Dayjs } from 'dayjs';

type ApplyFormProps = {
    socket: WebSocket
    nameRef: React.RefObject<InputRef>
    placeRef: React.RefObject<BaseSelectRef>
    calendarRef: React.RefObject<{v: Dayjs}>
}

const acOptions = [
    { value: 'Burns Bay Road' },
    { value: 'Downing Street' },
    { value: 'Wall Street' },
];

const ApplyForm: React.FC<ApplyFormProps> = ({ socket, nameRef, placeRef, calendarRef }) => {
    const [inputValue, setInputValue] = React.useState('');
    const formStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        padding: 8
    };
    const fieldStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        marginTop: "8px",
        marginBottom: "8px"
    };
    const updateSocket = () => {
        const n = nameRef.current?.input?.value;
        const p = inputValue;
        const t = calendarRef.current!.v.format('DD-MM-YYYY');
        const d = JSON.stringify({ name: n, place: p, date: t })
        socket.send(d);
    };
    return (
        <Col style={formStyle}>
            <Row style={fieldStyle} >
                <Col flex="100px" style={{ display: "flex" }}>Name:</Col>
                <Col flex="auto" style={{ display: "flex" }}><Input ref={nameRef} style={{ width: "100%" }} placeholder='Beer drinker' /></Col>
            </Row>
            <Row style={fieldStyle} >
                <Col flex="100px" style={{ display: "flex" }}>Place:</Col>
                <Col flex="auto" style={{ display: "flex" }}>
                    <AutoComplete value={inputValue}  onChange={(data, option)=> setInputValue(data)} onSelect={(_, option)=>setInputValue(option.value)}style={{ width: "100%" }} placeholder='Select location or suggest your own' options={acOptions} filterOption={(inputValue, option) =>
                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    } ref={placeRef} />
                </Col>

            </Row>
            <Row><Button block onClick={updateSocket}> Apply for a cup</Button></Row>
            <Image src={require('./images/cup.png')} alt='beer-cup' preview={false} />

        </Col>
    );
};

export default ApplyForm;