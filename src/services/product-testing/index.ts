export {
  createTestSession,
  startTestSession,
  blockTestSession,
  updateTestSession,
  updateTaskResult,
  addSessionEvidence,
  completeTestSession,
  abandonTestSession,
  getValidCompletedTestSession,
  buildPublicHandsOnSummary,
  productHasHandsOnTest,
  getProtocolForSession,
  getTestProtocolBySlug,
  getTestProtocolForCategory,
  listTestProtocols,
  resolveProtocolForProduct,
  listTestSessions,
  listTestSessionsForProduct,
  loadTestSession,
} from "./sessions";

export {
  buildProductTestingQueue,
  formatProductTestingQueueMarkdown,
  DEFAULT_TESTING_QUEUE_LIMIT,
  type TestingQueueItem,
} from "./queue";

export {
  buildTestCoverageMetrics,
  type TestCoverageMetrics,
} from "./coverage";

export {
  propagateHandsOnEvidence,
  loadEvidenceRefreshTasks,
  writeEvidenceRefreshTasks,
  type EvidenceRefreshTask,
  type EvidenceRefreshTaskStore,
} from "./dependent-refresh";

export {
  saveTestingScreenshot,
  TESTING_SCREENSHOT_MAX_BYTES,
} from "./screenshots";
