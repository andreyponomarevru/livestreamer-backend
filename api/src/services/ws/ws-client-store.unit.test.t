import util from "util";
import WebSocket from "ws";
import { beforeEach, jest, describe, it, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../config/logger";
import { WSClientStore } from "./ws-client-store";

// Supress logging
jest.mock("../../../src/config/logger");

console.log();

describe("WSClientStore class", () => {
  function createClient() {
    return {
      id: faker.number.int(),
      uuid: uuidv4(),
      username: faker.internet.userName(),
      socket: {} as WebSocket,
    };
  }
  const client1 = createClient();
  const client2 = createClient();
  const client3 = createClient();

  const schedulerMock = { start: jest.fn(), stop: jest.fn() };
  let clientStore: WSClientStore;

  beforeEach(() => {
    clientStore = new WSClientStore(schedulerMock);
    schedulerMock.start.mockClear();
    schedulerMock.stop.mockClear();
    (logger.debug as any).mockClear();
  });
  /*
  describe("addClient method", () => {
    it("adds a new client to the store", () => {
      const addClientSpy = jest.spyOn(clientStore, "addClient");

      clientStore.addClient(client1);

      expect(addClientSpy).toHaveBeenCalledWith(client1);
      expect(addClientSpy).toHaveBeenCalledTimes(1);

      addClientSpy.mockRestore();
    });

    it("emits 'add_client' event with added client as argument", () => {
      const addClient = jest.fn();
      clientStore.on("add_client", addClient);

      clientStore.addClient(client1);

      expect(addClient).toHaveBeenCalledTimes(1);
      expect(addClient).toHaveBeenCalledWith({
        uuid: client1.uuid,
        username: client1.username,
      });
    });

    it("schedules stats updates, when the first client is added to the store", () => {
      clientStore.addClient(client1);

      expect(schedulerMock.start).toHaveBeenCalledTimes(1);
    });

    it("stops emitting stats updates, when no clients left in the store", () => {
      clientStore.addClient(client1);
      clientStore.addClient(client2);

      clientStore.deleteClient(client1.uuid);
      expect(schedulerMock.stop).not.toHaveBeenCalled();

      clientStore.deleteClient(client2.uuid);
      expect(schedulerMock.stop).toHaveBeenCalled();
    });
  });

  describe("deleteClient method", () => {
    it("deletes a client from the store by client's uuid", () => {
      const deleteClientSpy = jest.spyOn(clientStore, "deleteClient");
      clientStore.addClient(client1);

      clientStore.deleteClient(client1.uuid);

      expect(deleteClientSpy).toHaveBeenCalledTimes(1);
      expect(deleteClientSpy).toHaveBeenCalledWith(client1.uuid);
      expect(clientStore.clients.length).toEqual(0);

      deleteClientSpy.mockRestore();
    });

    it("does not throw an error on attempt to delete non-existent client", () => {
      clientStore.addClient(client1);

      expect(() => clientStore.getClient(uuidv4())).not.toThrowError();
    });

    it("emits 'delete_client' event with the client as argument when the client deleted", () => {
      const deleteClient = jest.fn();
      clientStore.on("delete_client", deleteClient);
      clientStore.addClient(client1);

      clientStore.deleteClient(client1.uuid);

      expect(deleteClient).toBeCalledTimes(1);
      expect(deleteClient).toHaveBeenCalledWith({
        uuid: client1.uuid,
        username: client1.username,
        id: client1.id,
      });
    });
  });

  describe("getClient method", () => {
    it("retrieves a client from the store by uuid", () => {
      const getClientSpy = jest.spyOn(clientStore, "getClient");
      clientStore.addClient(client1);

      const clientFromStore = clientStore.getClient(client1.uuid);

      expect(getClientSpy).toHaveBeenCalledTimes(1);
      expect(getClientSpy).toHaveBeenCalledWith(client1.uuid);
      expect(client1).toStrictEqual(clientFromStore);

      getClientSpy.mockRestore();
    });

    it("does not throw an error on attempt to retrieve non-existent client", () => {
      expect(() =>
        clientStore.getClient(faker.internet.userName()),
      ).not.toThrowError();

      expect(clientStore.getClient(faker.internet.userName())).toBeUndefined();
    });
  });

  describe("clients getter", () => {
    it("returns all clients as an array", () => {
      const clientsSpy = jest.spyOn(clientStore, "clients", "get");

      clientStore.addClient(client1);
      clientStore.addClient(client2);
      clientStore.addClient(client3);

      const clients = clientStore.clients;

      expect(clientsSpy).toBeCalledTimes(1);
      expect(clients).toStrictEqual([client1, client2, client3]);

      clientsSpy.mockRestore();
    });
  });

  describe("clientCount getter", () => {
    it("returns current client count", () => {
      expect(clientStore.clientCount).toBe(0);

      const clientCountSpy = jest.spyOn(clientStore, "clientCount", "get");

      clientStore.addClient(client1);

      expect(clientStore.clientCount).toBe(1);
      expect(clientCountSpy).toBeCalled();

      clientStore.addClient(client2);
      expect(clientStore.clientCount).toBe(2);

      clientCountSpy.mockRestore();
    });
  });

  describe("sanitizedClients getter", () => {
    it("returns an array of sanitized clients", () => {
      const sanitizedClientsSpy = jest.spyOn(
        clientStore,
        "sanitizedClients",
        "get",
      );

      clientStore.addClient(client1);
      clientStore.addClient(client2);

      const sanitizedClients = clientStore.sanitizedClients;

      expect(sanitizedClientsSpy).toHaveBeenCalledTimes(1);
      expect(sanitizedClients).toStrictEqual([
        { uuid: client1.uuid, username: client1.username },
        { uuid: client2.uuid, username: client2.username },
      ]);

      sanitizedClientsSpy.mockRestore();
    });
  });*/
});
