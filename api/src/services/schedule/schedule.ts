import * as schedulesDB from "../../models/schedule/queries";

import * as scheduleDB from "../../models/schedule/queries";

export async function scheduleBroadcast(broadcast: {
  title: string;
  startAt: string;
  endAt: string;
}) {
  return await schedulesDB.create(broadcast);
}

export async function destroyScheduledBroadcast(broadcastId: number) {
  await schedulesDB.destroy(broadcastId);
}

export async function readAllScheduledBroadcasts() {
  return await scheduleDB.readAll();
}
