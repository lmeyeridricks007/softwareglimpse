/**
 * Category-specific readiness catalogs plugged into the shared scoring engine.
 */

import type { ReadinessAssessmentVersion } from "@/domain";
import {
  READINESS_DIMENSIONS,
  READINESS_QUESTIONS,
  getQuestionById as getCrmQuestionById,
  type ReadinessDimensionDef,
  type ReadinessQuestionDef,
} from "./catalog";
import {
  SI_READINESS_ASSESSMENT_VERSION,
  SI_READINESS_DIMENSIONS,
  SI_READINESS_QUESTIONS,
  getSiQuestionById,
} from "./si-catalog";
import { CRM_READINESS_ASSESSMENT_VERSION } from "@/domain";

export type ReadinessCatalogPack = {
  assessmentVersion: ReadinessAssessmentVersion;
  dimensions: ReadinessDimensionDef[];
  questions: ReadinessQuestionDef[];
  getQuestionById: (id: string) => ReadinessQuestionDef | undefined;
};

export const CRM_READINESS_CATALOG: ReadinessCatalogPack = {
  assessmentVersion: CRM_READINESS_ASSESSMENT_VERSION,
  dimensions: READINESS_DIMENSIONS,
  questions: READINESS_QUESTIONS,
  getQuestionById: getCrmQuestionById,
};

export const SI_READINESS_CATALOG: ReadinessCatalogPack = {
  assessmentVersion: SI_READINESS_ASSESSMENT_VERSION,
  dimensions: SI_READINESS_DIMENSIONS,
  questions: SI_READINESS_QUESTIONS,
  getQuestionById: getSiQuestionById,
};
