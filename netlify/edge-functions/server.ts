/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { Context } from "https://edge.netlify.com";
import { ServerContext } from "$fresh/server.ts";
import manifest from "../../fresh.gen.ts";

const ctx = await ServerContext.fromManifest(manifest, {
	staticDir: "_invalid",
});

const staticManifest = new Set(["/favicon.ico", "/logo.svg"]);

const freshHandler = ctx.handler();
// (Deno.run as unknown) = undefined;

export default async function handler(request: Request, context: Context) {
	if (!Deno.env.get("HOME")) {
		Deno.env.set("HOME", "/tmp");
	}
	const requestURL = new URL(request.url);
	const pathname = requestURL.pathname;
	if (staticManifest.has(pathname)) {
		return;
	}
	return await freshHandler(request, {
		localAddr: {
			hostname: requestURL.hostname,
			port: Number(requestURL.port),
			transport: "tcp",
		},
		remoteAddr: {
			hostname: context.ip,
			port: 0,
			transport: "tcp",
		},
	});
}


export const config = {
	path: "/*",
}