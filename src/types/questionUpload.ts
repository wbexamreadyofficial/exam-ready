/**
 * Mirrors the `questionsetuploads` collection and the wizard's API responses.
 *
 * Hierarchy stored in each committed upload:
 *   questionsetuploads
 *     └─ categoryResolution.resolvedId  → examcategories._id
 *     └─ subjectResolutions[n].resolvedId → subjects._id  (global, no category)
 *     └─ examResolution.resolvedId       → exams._id
 *     └─ questionSet                     → questionsets._id
 *     └─ questions                       → questions._id[]
 *
 * Each question stored in the `questions` collection carries:
 *   subjectId   → subjects._id
 *   examId      → exams._id
 *   questionSet → questionsets._id
 *   createdBy   → users._id
 */

export type UploadStatus =
  | 'rejected'
  | 'parsed'
  | 'resolving'
  | 'ready'
  | 'committed'
  | 'cancelled';

export type ResolutionAction = 'pending' | 'use_existing' | 'create_new';

export interface Resolution {
  parsedName?: string;
  action: ResolutionAction;
  existingId?: string | null;
  newName?: string;
  /** Populated after the step is saved — this is the actual _id stored on documents. */
  resolvedId?: string | null;
}

export interface ParsedOption {
  key: string;
  text: string;
  textBn?: string;
}

export interface ParsedQuestion {
  number: number;
  text: string;
  textBn?: string;
  options: ParsedOption[];
  answerKey: string | null;
  /**
   * The raw subject NAME as parsed from the PDF (e.g. "Polity").
   * After commit this is mapped to subjects._id via subjectResolutions.
   * The committed question document stores subjectId, NOT this name.
   */
  subject?: string;
  difficulty?: string;
  explanation?: string;
  explanationBn?: string;
  sectionKey?: string;
  confidence: number;
  issues: string[];
  decision: 'include' | 'skip';
  editedByOperator?: boolean;
}

/** Both languages arrive from the API, so the panel never has to translate them. */
export interface UploadIssue {
  code: string;
  message: string;
  messageBn?: string;
  questionNumber?: number;
}

export interface UploadSection {
  key: string;
  name: string;
  questionCount: number;
}

export interface UploadMeta {
  EXAM?: string;
  SET_TITLE?: string;
  AUTHOR?: string;
  LANGUAGE?: string;
  CATEGORY?: string;
  DURATION?: number;
  TOTAL_QUESTIONS?: number;
  MARKS_PER_QUESTION?: number;
  NEGATIVE_MARKS?: number;
  PASSING_MARKS?: number;
  DIFFICULTY?: string;
}

/**
 * One document from the `questionsetuploads` collection.
 *
 * Tracks the entire wizard state plus every _id created at commit time
 * so any upload can be audited end-to-end.
 */
export interface QuestionUpload {
  _id: string;

  /** The file as stored in ImageKit / S3. */
  file: {
    fileId?: string;
    name: string;
    /** Full URL to the uploaded PDF/docx in ImageKit. */
    url?: string;
    sizeBytes?: number;
    mimeType?: string;
  };

  uploaderName: string;
  /** users._id of the admin who ran the upload. */
  createdBy?: string;

  status: UploadStatus;
  /** 3–9; which wizard step the operator should be on. */
  currentStep: number;

  meta: UploadMeta;
  parsedQuestions: ParsedQuestion[];
  sections: UploadSection[];

  parseErrors: UploadIssue[];
  parseWarnings: UploadIssue[];

  stats: {
    declaredTotal?: number;
    parsedTotal?: number;
    missingNumbers?: number[];
    lowConfidence?: number;
    extractedChars?: number;
  };

  /** Step 4 — maps to examcategories._id */
  categoryResolution: Resolution;

  /**
   * Step 5 — one entry per unique subject name found in the PDF.
   * Each resolvedId points to subjects._id (global, no category scope).
   */
  subjectResolutions: Resolution[];

  /** Step 6 — maps to exams._id (exam belongs to the resolved category) */
  examResolution: Resolution;

  /** Step 7 — the confirmed name for the new questionsets document */
  setName?: string;
  setNameConfirmed: boolean;

  /** Step 8 — the marking scheme the operator accepted. */
  pattern?: UploadPattern;

  // ── IDs created at commit time ──────────────────────────────────────────────

  /** categories._id this upload resolved to. */
  category?: string | null;
  /** subjects._id[] — one per subject named in the file. */
  subjects?: string[];
  /** exams._id this upload resolved to. */
  exam?: string | null;
  /** questionsets._id of the set created by this upload. */
  questionSet?: string | null;
  /** questions._id[] for every question written by this upload. */
  questions?: string[];

  committedAt?: string;
  createdAt: string;
}

/** An existing record that looks like a name found in the file. */
export interface NameMatch {
  id: string;
  name: string;
  exact: boolean;
}

/** The marking scheme stored on an upload once step 8 is answered. */
export interface UploadPattern {
  durationMinutes?: number;
  marksPerQuestion?: number;
  negativeMarksPerQuestion?: number;
  totalMarks?: number;
  passingMarks?: number | null;
  confirmed?: boolean;
}

/**
 * What step 8 should show. `requiredQuestions` is derived server-side as
 * `totalMarks / marksPerQuestion` — the number the set must reach to publish.
 */
export interface PatternDraft extends Required<Omit<UploadPattern, 'passingMarks'>> {
  passingMarks: number | null;
  requiredQuestions: number;
  includedQuestions: number;
}

export interface PatternInput {
  durationMinutes: number;
  marksPerQuestion: number;
  negativeMarksPerQuestion: number;
  totalMarks: number;
  passingMarks?: number;
}

export interface NewQuestionInput {
  text: string;
  textBn?: string;
  options: ParsedOption[];
  answerKey: string;
  subject?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  explanation?: string;
  explanationBn?: string;
}

export interface StepOptions {
  upload: QuestionUpload;
  categoryMatches: NameMatch[];
  examMatches: NameMatch[];
  subjectMatches: { parsedName: string; matches: NameMatch[] }[];
  pattern: PatternDraft;
}

export interface NameCheckResult {
  available: boolean;
  reason: 'TOO_SHORT' | 'DUPLICATE' | null;
  message: string | null;
  messageBn: string | null;
  suggestion: string | null;
}

export interface ResolveInput {
  action: 'use_existing' | 'create_new';
  existingId?: string;
  newName?: string;
}

export interface SubjectResolveInput extends ResolveInput {
  parsedName: string;
}

export interface QuestionEditInput {
  decision?: 'include' | 'skip';
  text?: string;
  textBn?: string;
  options?: ParsedOption[];
  answerKey?: string;
  subject?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  explanation?: string;
}

/**
 * Payload for the commit call.
 *
 * The backend cannot reliably re-derive resolved _ids from old state, so the
 * wizard sends them all explicitly.  Every ObjectId reference the backend
 * needs to write on questions / questionsets is in this payload.
 */
export interface CommitPayload {
  /** users._id of the admin committing the upload. */
  createdBy: string;
  /** examcategories._id resolved in step 4. */
  categoryId: string | null;
  /** exams._id resolved in step 6. */
  examId: string | null;
  /**
   * One entry per unique subject name found in the PDF.
   * parsedName maps each raw name to the resolved subjects._id
   * so the backend can set subjectId on each question (never the string name).
   */
  subjectMappings: Array<{ parsedName: string; subjectId: string | null }>;
}

/** Errors the wizard shows verbatim, so the API owns the wording. */
export interface ApiFailure {
  message: string;
  messageBn?: string;
  code?: string;
}
