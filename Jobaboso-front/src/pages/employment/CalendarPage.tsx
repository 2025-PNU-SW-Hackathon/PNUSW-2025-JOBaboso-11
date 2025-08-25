import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import './CustomCalendar.css'; // 스타일 커스텀용
import { Callout } from '@components/common/Callout';
import { InfoTooltip } from '@components/employment/InfoTooltip';
import { Schedule, ScheduleLabelMap, ScheduleStyleMap } from '@type/Schedules';
import { getMonthlyCalendar, CalendarSchedule, CalendarResponse } from '@apis/employment';

const CalendarPage = () => {
  const [value, setValue] = useState(new Date());
  const [schedules, setSchedules] = useState<CalendarSchedule[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCalendarData = async (year: number, month: number) => {
    setLoading(true);
    try {
      const data = await getMonthlyCalendar(year, month);
      console.log('캘린더 데이터:', data);
      setSchedules(data.schedules);
    } catch (error) {
      console.error('캘린더 데이터 요청 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const year = dayjs(value).year();
    const month = dayjs(value).month() + 1;
    console.log(`${year}년 ${month}월 일정 조회`);
    fetchCalendarData(year, month);
  }, [value]);

  const getSchedulesByDate = (date: Date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    const daySchedules = schedules.filter(
      (s) => dayjs(s.start_date).format('YYYY-MM-DD') === dateStr
    );
    if (daySchedules.length > 0) {
      console.log(`${dateStr} 일정:`, daySchedules);
    }
    return daySchedules;
  };

  const handlePrevMonth = () => {
    setValue((prev) => dayjs(prev).subtract(1, 'month').toDate());
  };

  const handleNextMonth = () => {
    setValue((prev) => dayjs(prev).add(1, 'month').toDate());
  };

  const handleToday = () => {
    setValue(new Date());
  };

  return (
    <>
      <Callout text="김잡메 님의 취업 일정과 관련된 내용이 캘린더에 노출돼요." />

      {/* ✅ 커스텀 달 네비게이션 */}
      <div className="mb-8 mt-8 flex items-center justify-between">
        <div className="flex items-center gap-1 text-h2 text-gray-800">
          {dayjs(value).format('YYYY년 M월')}
          <div className="group peer relative">
            <InfoTooltip />
          </div>
        </div>
        <div className="flex items-center gap-1 text-h4 text-gray-800">
          <button onClick={handlePrevMonth} className="hover:text-black">
            &lt;
          </button>
          <button onClick={handleToday} className="px-2 font-medium hover:text-black">
            오늘
          </button>
          <button onClick={handleNextMonth} className="hover:text-black">
            &gt;
          </button>
        </div>
      </div>

      {loading && <div className="mb-4 text-center text-gray-600">일정을 불러오는 중...</div>}

      <Calendar
        locale="ko"
        calendarType="gregory"
        showNavigation={false}
        selectRange={false}
        onClickDay={() => {}}
        tileClassName="!flex !flex-col !items-start !justify-start"
        tileContent={({ date }) => {
          const daySchedules = getSchedulesByDate(date);
          if (daySchedules.length === 0) return null;

          return (
            <div
              className="flex flex-col items-start gap-1 self-start"
              style={{ alignSelf: 'flex-start', justifyContent: 'flex-start', marginTop: '25px' }}
            >
              {daySchedules.map((s, i) => (
                <div
                  key={i}
                  className={`cursor-pointer px-2 py-1 text-[11px] transition-opacity hover:opacity-80 ${ScheduleStyleMap[s.schedule_type]}`}
                  style={{
                    height: 'auto',
                    borderRadius: '4px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '22px',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                  }}
                  title={`${s.company_name} - ${ScheduleLabelMap[s.schedule_type]}\n${dayjs(s.start_date).format('MM/DD HH:mm')} ~ ${dayjs(s.end_date).format('MM/DD HH:mm')}${s.notes ? `\n${s.notes}` : ''}`}
                >
                  [{ScheduleLabelMap[s.schedule_type]}] {s.company_name}
                </div>
              ))}
            </div>
          );
        }}
      />
    </>
  );
};

export default CalendarPage;
