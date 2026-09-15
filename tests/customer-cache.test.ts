import { describe, expect, it } from "vitest";
import {
  createCustomerQueryClient,
  restoreCustomerCache,
} from "../lib/data/customer-cache";

describe("customer data cache", () => {
  it("deduplicates prefetch and screen reads, then reuses fresh results", async () => {
    const client = createCustomerQueryClient();
    let calls = 0;
    const options = {
      queryKey: ["shipments"],
      queryFn: async () => {
        calls++;
        return [{ id: "one" }];
      },
    };
    await Promise.all([
      client.prefetchQuery(options),
      client.fetchQuery(options),
    ]);
    expect(await client.fetchQuery(options)).toEqual([{ id: "one" }]);
    expect(calls).toBe(1);
    client.clear();
  });
  it("keeps cached content after a failed background refresh", async () => {
    const client = createCustomerQueryClient();
    client.setQueryData(["shipments"], [{ id: "one" }]);
    await expect(
      client.fetchQuery({
        queryKey: ["shipments"],
        staleTime: 0,
        queryFn: async () => {
          throw Error("offline");
        },
      }),
    ).rejects.toThrow("offline");
    expect(client.getQueryData(["shipments"])).toEqual([{ id: "one" }]);
    client.clear();
  });
  it("never hydrates another customer or overwrites a newer server response", () => {
    const client = createCustomerQueryClient();
    const saved = {
      owner: "a",
      entries: [{ key: ["profile"], data: { name: "Old" }, updatedAt: 1000 }],
    };
    restoreCustomerCache(client, "b", saved, 2000);
    expect(client.getQueryData(["profile"])).toBeUndefined();
    client.setQueryData(["profile"], { name: "New" }, { updatedAt: 1500 });
    restoreCustomerCache(client, "a", saved, 2000);
    expect(client.getQueryData(["profile"])).toEqual({ name: "New" });
    client.clear();
  });
  it("hydrates valid empty results but rejects expired disk data", () => {
    const client = createCustomerQueryClient();
    restoreCustomerCache(
      client,
      "a",
      {
        owner: "a",
        entries: [{ key: ["shipments"], data: [], updatedAt: 1000 }],
      },
      2000,
    );
    expect(client.getQueryData(["shipments"])).toEqual([]);
    restoreCustomerCache(
      client,
      "a",
      {
        owner: "a",
        entries: [{ key: ["profile"], data: {}, updatedAt: 1000 }],
      },
      90_000_000,
    );
    expect(client.getQueryData(["profile"])).toBeUndefined();
    client.clear();
  });
  it("isolates late requests in the old session client", async () => {
    const first = createCustomerQueryClient(),
      second = createCustomerQueryClient();
    const pending = first.fetchQuery({
      queryKey: ["profile"],
      queryFn: async () => ({ name: "First" }),
    });
    first.clear();
    await pending.catch(() => {});
    expect(second.getQueryData(["profile"])).toBeUndefined();
    second.clear();
  });
});
