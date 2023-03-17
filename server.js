import { createRequestHandler } from "@remix-run/node";
import * as build from "@remix-run/dev/server-build";

export default createRequestHandler({ build, mode: process.env.NODE_ENV });
