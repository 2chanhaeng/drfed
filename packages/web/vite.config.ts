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

import process from "node:process";

import { solidStart } from "@solidjs/start/config";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";
import { cjsInterop } from "vite-plugin-cjs-interop";
import relay from "vite-plugin-relay-lite";

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      solidStart(),
      nitro({
        routeRules: {
          "/graphql": {
            proxy: {
              to: `${env.VITE_BACKEND_URL}/graphql`,
              forwardHeaders: ["accept"],
            },
          },
        },
      }),
      relay({ codegen: command !== "build" }),
      {
        ...cjsInterop({ dependencies: ["relay-runtime"] }),
        applyToEnvironment: (environment) => environment.name === "ssr",
      },
    ],
  };
});
