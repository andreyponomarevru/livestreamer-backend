import React, { ReactElement } from "react";

import "./schedule-item.scss";

interface ScheduleItemProps {
  className?: string;
}

export function ScheduleItem(props: ScheduleItemProps): ReactElement {
  const { className = "" } = props;

  return (
    <div className={`schedule-item ${className}`}>
      <span className="schedule-item__date">23.1.2013</span>
      <span className="schedule-item__time">14:30—18:00</span>
      <span className="schedule-item__description">Chillout Live</span>
    </div>
  );
}
