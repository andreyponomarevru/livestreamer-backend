import * as React from "react";

import { ScheduleForm } from "./schedule-form/schedule-form";
import { PageHeading } from "../../lib/page-heading/page-heading";
import { API_ROOT_URL } from "../../config/env";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { useFetch } from "../../hooks/use-fetch";
import { ScheduledBroadcastResponse } from "../../types";
import { Loader } from "../../lib/loader/loader";
import { Message } from "../../lib/message/message";
import { ScheduledBroadcast } from "./scheduled-broadcast/scheduled-broadcast";
import { Page } from "../../lib/page/page";
import { hasPermission } from "../../utils/has-permission";
import { useAuthN } from "../../hooks/use-authn";

import "../../lib/btn/btn.scss";
import "../../lib/items-list/items-list.scss";
import "./schedule.scss";

export function PagesSchedule(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  const auth = useAuthN();
  const isMounted = useIsMounted();
  const { state: broadcasts, fetchNow: sendBroadcastsRequest } =
    useFetch<ScheduledBroadcastResponse>();

  React.useEffect(() => {
    if (isMounted) {
      sendBroadcastsRequest(`${API_ROOT_URL}/schedule`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
      });
    }
  }, [isMounted]);

  //

  // TODO: implement "Schedule broadcast" feature
  function scheduleBroadcast({
    title,
    startAt,
    endAt,
  }: {
    title: string;
    startAt: string;
    endAt: string;
  }) {
    const URL = `${API_ROOT_URL}/schedule`; // POST
  }

  // TODO: implement "Delete scheduled broadcast" feature
  function destroyScheduledBroadcast(id: number) {
    const URL = `${API_ROOT_URL}/schedule/${id}`; // DELETE
  }

  //

  return (
    <Page className="page_list">
      <PageHeading iconName="calendar" name="Schedule" />

      <div className="schedule-page__timezone">Moscow Time (GMT+3)</div>

      {hasPermission(
        { resource: "scheduled_broadcast", action: "create" },
        auth.user
      ) && <ScheduleForm />}

      {broadcasts.isLoading && <Loader color="pink" for="page" />}

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
