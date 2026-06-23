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
import { instanceMembers } from "@drfed/models/schema";
import { and, eq, isNotNull } from "drizzle-orm/sql/expressions";

import builder, { type DrFedObjectRef } from "./builder.ts";

const InstanceRef = builder.drizzleNode("instances", {
  name: "Instance",
  description: "Represents an `Instance` in the DrFed platform.",
  id: {
    column(instance) {
      return instance.id;
    },
    description: "The unique identifier of the `Instance`.",
  },
  fields: (t) => ({
    uuid: t.expose("id", {
      type: "UUID",
      description: "The UUID of the `Instance`.",
    }),
    slug: t.exposeString("slug"),
    expires: t.expose("expires", {
      type: "DateTime",
      description: "The expiration date/time of the `Instance`.",
    }),
    created: t.expose("created", {
      type: "DateTime",
      description: "The creation date/time of the `Instance`.",
    }),
    // We can simplify the below connection by using `relatedConnection()`
    // when Drizzle ORM supports additional filters on the junction table
    // for relations.  See also the below issue:
    // https://github.com/drizzle-team/drizzle-orm/issues/5343
    members: t.drizzleConnection({
      type: "accounts",
      description: "The `Account`s that belong to the `Instance`.",
      totalCount(parent, _args, ctx) {
        return ctx.db.$count(
          instanceMembers,
          and(
            eq(instanceMembers.instanceId, parent.id),
            isNotNull(instanceMembers.accepted),
          ),
        );
      },
      resolve(query, parent, _args, ctx) {
        return ctx.db.query.accounts.findMany(
          query({
            where: {
              instanceMembers: { instanceId: parent.id },
            },
          }),
        );
      },
    }),
  }),
});

export const Instance: DrFedObjectRef = InstanceRef;
