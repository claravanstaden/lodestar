import {AbortSignal} from "@chainsafe/abort-controller";
import {IExecutionEngine} from "./interface";
import {ExecutionEngineDisabled} from "./disabled";
import {ExecutionEngineHttp, ExecutionEngineHttpOpts, defaultExecutionEngineHttpOpts} from "./http";
import {ExecutionEngineMock, ExecutionEngineMockOpts} from "./mock";
import {IMetrics} from "../metrics";

export {IExecutionEngine, ExecutionEngineHttp, ExecutionEngineDisabled, ExecutionEngineMock};

export type ExecutionEngineOpts =
  | ({mode?: "http"} & ExecutionEngineHttpOpts)
  | ({mode: "mock"} & ExecutionEngineMockOpts)
  | {mode: "disabled"};

export const defaultExecutionEngineOpts: ExecutionEngineOpts = defaultExecutionEngineHttpOpts;

export function initializeExecutionEngine(
  metrics: IMetrics | null,
  opts: ExecutionEngineOpts,
  signal: AbortSignal
): IExecutionEngine {
  switch (opts.mode) {
    case "mock":
      return new ExecutionEngineMock(opts);
    case "disabled":
      return new ExecutionEngineDisabled();
    case "http":
    default:
      return new ExecutionEngineHttp({metrics}, opts, signal);
  }
}
