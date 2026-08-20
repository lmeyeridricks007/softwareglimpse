import type {
  WorkflowRun,
  WorkflowStepRun,
  WorkflowHandlerId,
} from "@/domain";

export type HandlerContext = {
  run: WorkflowRun;
  step: WorkflowStepRun;
  dryRun?: boolean;
  /** Test hook: inject transient failure on first attempt */
  transientFailOnceKeys?: Set<string>;
};

export type HandlerResult = {
  status: WorkflowStepRun["status"];
  outputRefs?: Record<string, string>;
  inputRefs?: Record<string, string>;
  inputSnapshot?: WorkflowStepRun["inputSnapshot"];
  blockers?: string[];
  warnings?: string[];
  error?: string;
  draftId?: string;
  agentTaskId?: string;
  approvalId?: string;
  /** Signal that error is retryable */
  retryable?: boolean;
  retryErrorCode?: string;
  historyMessage?: string;
};

export type WorkflowHandler = {
  id: WorkflowHandlerId;
  execute(ctx: HandlerContext): Promise<HandlerResult>;
};

const HANDLERS = new Map<WorkflowHandlerId, WorkflowHandler>();

export function registerHandler(handler: WorkflowHandler): void {
  HANDLERS.set(handler.id, handler);
}

export function getHandler(id: WorkflowHandlerId): WorkflowHandler {
  const h = HANDLERS.get(id);
  if (!h) throw new Error(`Workflow handler not registered: ${id}`);
  return h;
}

export function listHandlers(): WorkflowHandlerId[] {
  return [...HANDLERS.keys()];
}

export function hasHandler(id: string): boolean {
  return HANDLERS.has(id as WorkflowHandlerId);
}
