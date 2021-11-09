import React, { ReactElement, useEffect, Fragment } from "react";

import { ScheduleForm } from "./schedule-form/schedule-form";
import { PageHeading } from "../../lib/page-heading/page-heading";
import { ProtectedComponent } from "../../lib/protected-component/protected-component";
import { API_ROOT_URL } from "../../config/env";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { useFetch } from "../../hooks/use-fetch";
import { ScheduledBroadcastResponse } from "../../types";
import { Loader } from "../../lib/loader/loader";
import { Message } from "../../lib/message/message";
import { ScheduledBroadcast } from "./scheduled-broadcast/scheduled-broadcast";
import { Page } from "../../lib/page/page";

import "../../lib/btn/btn.scss";
import "../../lib/items-list/items-list.scss";
import "./schedule.scss";

export function PagesSchedule(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  const isMounted = useIsMounted();
  const [broadcasts, fetchBroadcastsNow] =
    useFetch<ScheduledBroadcastResponse>();

  useEffect(() => {
    if (isMounted) {
      fetchBroadcastsNow(`${API_ROOT_URL}/schedule`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
      });
    }
  }, [isMounted]);

  return (
    <Page className="page_list">
      <PageHeading iconName="calendar" name="Schedule" />

      <div className="schedule-page__timezone">Moscow Time (GMT+3)</div>

      <ProtectedComponent resource="scheduled_broadcast" action="create">
        <ScheduleForm />
      </ProtectedComponent>

      {broadcasts.isLoading && <Loader type="page" />}

      {broadcasts.error && (
        <Message type="danger">Something went wrong :(</Message>
      )}

      {broadcasts.response?.body && (
        <ul className="items-list">
          {broadcasts.response.body.results.map((broadcast) => {
            return (
              <ScheduledBroadcast
                key={broadcast.id}
                title={broadcast.title}
                startAt={new Date(broadcast.startAt).toLocaleString()}
                endAt={new Date(broadcast.endAt).toLocaleString()}
              />
            );
          })}
        </ul>
      )}
    </Page>
  );
}
