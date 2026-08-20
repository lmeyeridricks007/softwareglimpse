import {
  createEmptyCrmReadinessSession,
  type CrmReadinessSession,
  type ReadinessAnswer,
  type ReadinessAnswerValue,
  type ReadinessSnapshot,
  type ReadinessWizardStep,
} from "@/domain";
import {
  completeAssessment as completeAssessmentService,
  loadCrmReadinessSession,
  resetCrmReadinessSession,
  saveCrmReadinessSession,
  setAnswer as setAnswerService,
  startReassessment,
  touchCrmReadinessSession,
} from "@/services/readiness-assessment/persistence";

export function createEmptySession(): CrmReadinessSession {
  return createEmptyCrmReadinessSession();
}

export {
  loadCrmReadinessSession,
  resetCrmReadinessSession,
  saveCrmReadinessSession,
  startReassessment,
  touchCrmReadinessSession,
};

export function setAnswer(
  session: CrmReadinessSession,
  questionId: string,
  value: ReadinessAnswerValue,
  source: ReadinessAnswer["source"] = "user",
): CrmReadinessSession {
  return setAnswerService(session, questionId, value, source);
}

export function completeAssessment(
  session: CrmReadinessSession,
  snapshot: ReadinessSnapshot,
): CrmReadinessSession {
  return completeAssessmentService(session, snapshot);
}

export function setStep(
  session: CrmReadinessSession,
  wizardStep: ReadinessWizardStep,
): CrmReadinessSession {
  return touchCrmReadinessSession(session, { wizardStep });
}
