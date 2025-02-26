import { scheduleRepo } from "../../models/schedule/queries";

export const scheduleService = {
  scheduleBroadcast: async function (broadcast: {
    title: string;
    startAt: string;
    endAt: string;
  }) {
    return await scheduleRepo.create(broadcast);
  },

  destroyScheduledBroadcast: async function (broadcastId: number) {
    await scheduleRepo.destroy(broadcastId);
  },

  readAllScheduledBroadcasts: async function () {
    return await scheduleRepo.readAll();
  },
};
