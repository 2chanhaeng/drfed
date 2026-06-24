// DrFed: A web-based platform for developing and debugging ActivityPub apps
// Copyright (C) 2026 DrFed team
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { type Database, schema } from "@drfed/models";

import { withTestHarness } from "./harness.test.ts";

const accepted = new Date("2026-06-24T00:00:00.000Z");
const created = new Date("2026-06-24T00:00:00.000Z");
const expires = new Date("2026-07-24T00:00:00.000Z");
const ok = 200;

const accountId = "00000000-0000-4000-8000-000000000001";
const memberId = "00000000-0000-4000-8000-000000000002";
const pendingMemberId = "00000000-0000-4000-8000-000000000003";
const instanceId = "00000000-0000-4000-8000-000000000101";

const instanceMembersQuery = `
  query InstanceMembers($uuid: UUID!) {
    accountByUuid(uuid: $uuid) {
      instances {
        edges {
          node {
            members {
              totalCount
              edges {
                node {
                  uuid
                  email
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

const instanceMembersResponse = {
  data: {
    accountByUuid: {
      instances: {
        edges: [
          {
            node: {
              members: {
                totalCount: 2,
                edges: [
                  {
                    node: {
                      uuid: accountId,
                      email: "owner@example.com",
                      name: "Owner",
                    },
                  },
                  {
                    node: {
                      uuid: memberId,
                      email: "member@example.com",
                      name: "Member",
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  },
};

describe("Instance.members", () => {
  it("returns the instance's accepted members", async () => {
    await withTestHarness(async ({ db, post }) => {
      await seedInstanceMembers(db);

      const response = await post({
        query: instanceMembersQuery,
        variables: { uuid: accountId },
      });

      assert.equal(response.status, ok);
      assert.deepEqual(await response.json(), instanceMembersResponse);
    });
  });
});

async function seedInstanceMembers(db: Database): Promise<void> {
  await db.insert(schema.accounts).values([
    {
      id: accountId,
      email: "owner@example.com",
      name: "Owner",
      created,
    },
    {
      id: memberId,
      email: "member@example.com",
      name: "Member",
      created,
    },
    {
      id: pendingMemberId,
      email: "pending@example.com",
      name: "Pending",
      created,
    },
  ]);
  await db.insert(schema.instances).values({
    id: instanceId,
    slug: "test-instance",
    created,
    expires,
  });
  await db.insert(schema.instanceMembers).values([
    {
      accountId,
      instanceId,
      accepted,
      created,
    },
    {
      accountId: memberId,
      instanceId,
      accepted,
      created,
    },
    {
      accountId: pendingMemberId,
      instanceId,
      accepted: null,
      created,
    },
  ]);
}
