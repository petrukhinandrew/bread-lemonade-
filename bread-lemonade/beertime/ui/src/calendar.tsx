import React, { useEffect, useState } from 'react';
import './index.css';

import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { Calendar, Col, Row, Select, theme } from 'antd';
import type { CalendarProps } from 'antd';
import { Dayjs } from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import ruRU from 'antd/lib/date-picker/locale/ru_RU';
dayjs.extend(dayLocaleData);
dayjs.locale('ru');

type MyCalendarProps = {
  socket: WebSocket
  calendarRef: React.RefObject<{ v: Dayjs }>
};

type BeerApplication = {
  name: string
  place: string
  date: string
};

const MyCalendar: React.FC<MyCalendarProps> = ({ socket, calendarRef }) => {

  const [applications, setApplications] = useState<BeerApplication[]>([]);
  const [cv, setcv] = useState<Dayjs>(dayjs());

  socket.addEventListener("message", (e) => {
    try {
      const v = JSON.parse(e.data);
      setApplications(v);
    } catch {
      console.log("error readign json");
    }
  });

  const wrapperStyle: React.CSSProperties = {
    width: "20vw",
    minWidth: "260px",
    aspectRatio: 1
  };

  return (
    <Calendar
      value={cv}
      onChange={(date) => {
        setcv(date)
        calendarRef.current!.v = date;
      }}
      style={wrapperStyle}
      fullscreen={false}
      locale={ruRU}
      fullCellRender={(cur, info) => {
        let bc = 'transparent';
        let cf = cur.format('DD-MM-YYYY');
        let cnt = applications == null ? 0 : applications.filter((e: BeerApplication) => { return e.date == cf; }).length;
        if (info.today.format('DD-MM-YYYY') == cf && cv.format('DD-MM-YYYY') == cf) {
          bc = '#AD8551';
        } else {
          bc = (cnt == 0) ? 'transparent' : '#F7DF9C';
        }
        return (
          <div style={{ backgroundColor: bc, height: "100%" }} className='force-no-before'>
            {cur.date()}
            {cnt == 0 ? "" : <sup> {cnt} </sup>}
          </div>
        );
      }}
      headerRender={({ value, type, onChange, onTypeChange }) => {
        const start = 0;
        const end = 12;
        const monthOptions = [];
        let current = value.clone();
        const localeData = value.localeData();
        const months = [];
        for (let i = 0; i < 12; i++) {
          current = current.month(i);
          months.push(localeData.months(current));
        }
        for (let i = start; i < end; i++) {
          monthOptions.push(
            <Select.Option key={i} value={i} className="month-item">
              {months[i]}
            </Select.Option>
          );
        }
        const year = value.year();
        const month = value.month();
        const options = [];
        for (let i = year - 10; i < year + 10; i += 1) {
          options.push(
            <Select.Option key={i} value={i} className="year-item">
              {i}
            </Select.Option>
          );
        }
        return (
          <div >
            <Row gutter={0} justify={'center'}>
              <Col>
                <Select
                  size="middle"
                  popupMatchSelectWidth={false}
                  value={month}
                  suffixIcon={null}
                  style={{ marginLeft: 8, marginRight: 8 }}
                  onChange={(newMonth) => {
                    const now = value.clone().month(newMonth);
                    onChange(now);
                  }}
                >
                  {monthOptions}
                </Select>
              </Col>
              <Col>
                <Select
                  size="middle"
                  popupMatchSelectWidth={false}
                  value={year}
                  suffixIcon={null}
                  style={{ marginLeft: 8, marginRight: 8 }}
                  onChange={(newYear) => {
                    const now = value.clone().year(newYear);
                    onChange(now);
                  }}
                >
                  {options}
                </Select>
              </Col>
            </Row>
          </div>
        );
      }}
    />
  );
};

export default MyCalendar;