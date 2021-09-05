import React, { ReactElement, Fragment } from "react";

import { ScheduleItem } from "../../components/schedule-item/schedule-item";
import "../../components/lib/btn/btn.scss";
import { ScheduleForm } from "../../components/schedule-form/schedule-form";
import { PageHeading } from "../../components/lib/page-heading/page-heading";

import "./schedule.scss";

export function PagesSchedule(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  return (
    <main className="schedule-page">
      <PageHeading iconName="calendar" name="Schedule" />
      <ScheduleForm />
      <div className="schedule-page__description">Moscow Time (GMT+3)</div>
      <ScheduleItem />
      <ScheduleItem />
      <ScheduleItem />
      <ScheduleItem />
      <ScheduleItem />
      <ScheduleItem />
    </main>
  );
}
