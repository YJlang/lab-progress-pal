export type StageKey = "1" | "1.5" | "2" | "2.5" | "3" | "3.5" | "4" | "5" | "6";

export type StageStatus = "미시작" | "진행 중" | "부분 달성" | "달성";

export const STAGE_STATUS_OPTIONS: StageStatus[] = ["미시작", "진행 중", "부분 달성", "달성"];

export type StageStatuses = Record<StageKey, StageStatus>;

export interface ChecklistItem {
  key: string;
  label: string;
}

export interface Stage {
  key: StageKey;
  title: string;
  fullDescription: string;
  shortDescription: string;
  criteria: string;
  checklist: ChecklistItem[];
}

export const STAGES: Stage[] = [
  {
    key: "1",
    title: "Python 기초",
    fullDescription:
      "파이썬 기본 문법을 알고, 150줄 미만의 간단한 예제를 편하게 작성하고 실행 결과를 예측할 수 있는 단계.",
    shortDescription: "Python 기본 문법, 150줄 이내 프로그램 작성 및 실행 결과 예측",
    criteria: "Python Express 책 기준 클래스까지.",
    checklist: [
      { key: "py_vars", label: "Python 변수와 자료형" },
      { key: "py_control", label: "조건문과 반복문" },
      { key: "py_func", label: "함수" },
      { key: "py_list_dict", label: "리스트와 딕셔너리" },
      { key: "py_io", label: "기본 파일 입출력" },
      { key: "py_class", label: "클래스와 객체" },
      { key: "py_explain", label: "간단한 Python 코드 실행 결과 설명 가능" },
    ],
  },
  {
    key: "1.5",
    title: "C 언어",
    fullDescription:
      "C언어를 배운 학생의 경우, 함수, 2차원 배열, 구조체, 파일입출력, 포인터, Call by value, Call by reference를 이해하고 활용할 수 있는 단계.",
    shortDescription: "C 언어: 함수, 배열, 구조체, 포인터, call by value/reference 이해",
    criteria: "C언어 Express 책 기준 구조체, 포인터, 파일입출력까지.",
    checklist: [
      { key: "c_func", label: "C 함수" },
      { key: "c_2d_array", label: "2차원 배열" },
      { key: "c_struct", label: "구조체" },
      { key: "c_io", label: "파일 입출력" },
      { key: "c_pointer", label: "포인터 기초" },
      { key: "c_cbv", label: "Call by value" },
      { key: "c_cbr", label: "Call by reference" },
      { key: "c_explain", label: "간단한 C 코드 실행 결과 설명 가능" },
    ],
  },
  {
    key: "2",
    title: "외부 기기 실행",
    fullDescription:
      "개인 컴퓨터가 아닌 다른 기계에서 C언어 또는 파이썬 프로그램을 실행할 수 있는 단계.",
    shortDescription: "Raspberry Pi 등 외부 기기에서 C/Python 프로그램 실행",
    criteria: "예시: 라즈베리 파이 활용.",
    checklist: [
      { key: "rpi_connect", label: "Raspberry Pi 등 기기에 접속 가능" },
      { key: "rpi_run", label: "기기에서 Python/C 프로그램 실행 가능" },
      { key: "rpi_terminal", label: "기본 터미널 명령어 이해" },
      { key: "rpi_transfer", label: "기기로 파일 전송 가능" },
    ],
  },
  {
    key: "2.5",
    title: "비 Windows OS",
    fullDescription: "윈도우가 아닌 다른 운영체제를 설치하고 사용할 수 있는 단계.",
    shortDescription: "Linux, Raspbian 등 비 Windows OS 설치 및 활용",
    criteria: "예시: Linux, Raspbian, 다른 Linux 배포판.",
    checklist: [
      { key: "os_install", label: "Linux 또는 Raspbian 설치 가능" },
      { key: "os_terminal", label: "기본 Linux 터미널 명령어 사용" },
      { key: "os_perm", label: "디렉토리와 권한 이해" },
      { key: "os_pkg", label: "패키지 설치 가능" },
      { key: "os_troubleshoot", label: "기본 환경 문제 해결 가능" },
    ],
  },
  {
    key: "3",
    title: "자료구조와 알고리즘",
    fullDescription:
      "자료구조의 기본 개념을 이해하고, 스택, 큐, 트리 등의 필요성을 설명할 수 있는 단계. 정렬, 탐색의 기본을 알고, 재귀함수와 DP로 간단한 알고리즘 문제를 정의하고 풀 수 있는 단계.",
    shortDescription: "자료구조(스택/큐/트리), 정렬/탐색, 재귀/DP 기초",
    criteria: "정렬, 탐색, 재귀, DP 기본 문제 해결.",
    checklist: [
      { key: "ds_stack", label: "스택" },
      { key: "ds_queue", label: "큐" },
      { key: "ds_tree", label: "트리" },
      { key: "alg_sort", label: "정렬" },
      { key: "alg_search", label: "탐색" },
      { key: "alg_recursion", label: "재귀" },
      { key: "alg_dp", label: "기본 동적 계획법" },
      { key: "alg_solve", label: "간단한 알고리즘 문제 풀이 가능" },
    ],
  },
  {
    key: "3.5",
    title: "알고리즘 문제 풀이",
    fullDescription: "쉬운 난이도라도 알고리즘 문제를 100개 이상 풀어본 경험이 있는 단계.",
    shortDescription: "알고리즘 문제 100문제 이상 풀이 경험",
    criteria: "쉬운 난이도 기준 100문제 이상.",
    checklist: [
      { key: "ps_25", label: "25문제 풀이" },
      { key: "ps_50", label: "50문제 풀이" },
      { key: "ps_75", label: "75문제 풀이" },
      { key: "ps_100", label: "100문제 풀이" },
      { key: "ps_explain", label: "풀이한 문제를 다른 사람에게 설명 가능" },
    ],
  },
  {
    key: "4",
    title: "국내 학회 발표",
    fullDescription:
      "2장 분량의 국내 학술대회 논문을 작성하고, 최소 포스터 발표를 해본 경험이 있는 단계.",
    shortDescription: "국내 학술대회 논문 작성 및 포스터 발표 경험",
    criteria: "2페이지 논문 작성 + 포스터 발표.",
    checklist: [
      { key: "paper_topic", label: "연구 주제 선정" },
      { key: "paper_read", label: "관련 논문 읽기" },
      { key: "paper_write", label: "2페이지 논문 작성" },
      { key: "paper_poster", label: "포스터 준비" },
      { key: "paper_present", label: "국내 학회 발표" },
    ],
  },
  {
    key: "5",
    title: "국제 학회 발표",
    fullDescription:
      "영문으로 국제 학술대회 논문을 작성하고, 포스터 또는 구두 발표를 통해 해외 연구자들과 교류해본 경험이 있는 단계.",
    shortDescription: "국제 학술대회 논문 작성 및 영어 발표 경험",
    criteria: "영문 논문 작성 + 국제 학회 발표 (포스터/구두).",
    checklist: [
      { key: "intl_write", label: "영문 논문 작성" },
      { key: "intl_submit", label: "국제 학회 투고" },
      { key: "intl_revise", label: "리뷰 응답 및 수정" },
      { key: "intl_slides", label: "영어 발표 자료 준비" },
      { key: "intl_present", label: "국제 학회 발표" },
    ],
  },
  {
    key: "6",
    title: "SCIE 논문 제출",
    fullDescription:
      "SCIE 등재 저널을 선정하여 풀논문을 작성하고, 동료 검토 과정을 거쳐 게재까지 완료해본 경험이 있는 단계.",
    shortDescription: "SCIE 저널에 풀논문 작성 및 제출 경험",
    criteria: "SCIE 저널 풀논문 작성 + 제출 + 리뷰 대응.",
    checklist: [
      { key: "scie_select", label: "SCIE 저널 선정" },
      { key: "scie_write", label: "풀논문 작성" },
      { key: "scie_review", label: "동료 검토 응답" },
      { key: "scie_accept", label: "게재 승인" },
      { key: "scie_publish", label: "출판" },
    ],
  },
];

export const STAGE_MAP: Record<StageKey, Stage> = STAGES.reduce(
  (acc, s) => {
    acc[s.key] = s;
    return acc;
  },
  {} as Record<StageKey, Stage>,
);

export const STAGE_KEYS: StageKey[] = STAGES.map((s) => s.key);

export const STAGE_ORDER: Record<StageKey, number> = {
  "1": 0,
  "1.5": 1,
  "2": 2,
  "2.5": 3,
  "3": 4,
  "3.5": 5,
  "4": 6,
  "5": 7,
  "6": 8,
};

export const TOTAL_CHECKLIST_ITEMS = STAGES.reduce((sum, s) => sum + s.checklist.length, 0);

export const DEFAULT_STAGE_STATUSES: StageStatuses = {
  "1": "미시작",
  "1.5": "미시작",
  "2": "미시작",
  "2.5": "미시작",
  "3": "미시작",
  "3.5": "미시작",
  "4": "미시작",
  "5": "미시작",
  "6": "미시작",
};

// ─── Progress calculation from checklists ───

export type ChecklistState = Partial<Record<StageKey, Record<string, boolean>>>;

export function countCompletedChecklistItems(checklist: ChecklistState): number {
  let n = 0;
  for (const stage of STAGES) {
    const stageState = checklist[stage.key] ?? {};
    for (const item of stage.checklist) {
      if (stageState[item.key]) n++;
    }
  }
  return n;
}

export function stageChecklistCompletion(
  checklist: ChecklistState,
  stageKey: StageKey,
): { done: number; total: number } {
  const stage = STAGE_MAP[stageKey];
  const state = checklist[stageKey] ?? {};
  const done = stage.checklist.filter((i) => state[i.key]).length;
  return { done, total: stage.checklist.length };
}

// ─── Progress calculation from statuses ───

const STATUS_WEIGHT: Record<StageStatus, number> = {
  미시작: 0,
  "진행 중": 0.25,
  "부분 달성": 0.6,
  달성: 1,
};

export function overallProgress(stageStatuses: StageStatuses, checklist: ChecklistState): number {
  let score = 0;
  const total = STAGES.length;
  for (const stage of STAGES) {
    const status = stageStatuses[stage.key] ?? "미시작";
    const checklistW = stageChecklistCompletion(checklist, stage.key);
    const checklistPct = checklistW.total > 0 ? checklistW.done / checklistW.total : 0;
    const base = STATUS_WEIGHT[status];
    // Blend: 70% status weight + 30% checklist completion within that status
    const blended = base * 0.7 + checklistPct * STATUS_WEIGHT["달성"] * 0.3;
    score += blended;
  }
  return Math.round((score / total) * 100);
}

export function stageCompletion(
  stageStatuses: StageStatuses,
  checklist: ChecklistState,
  stageKey: StageKey,
): { done: number; total: number; status: StageStatus } {
  const stage = STAGE_MAP[stageKey];
  const state = checklist[stageKey] ?? {};
  const done = stage.checklist.filter((i) => state[i.key]).length;
  return {
    done,
    total: stage.checklist.length,
    status: stageStatuses[stageKey] ?? "미시작",
  };
}

export function countByStatus(stageStatuses: StageStatuses, status: StageStatus): number {
  let n = 0;
  for (const key of STAGE_KEYS) {
    if ((stageStatuses[key] ?? "미시작") === status) n++;
  }
  return n;
}

export function isStageKey(v: string): v is StageKey {
  return (STAGE_KEYS as string[]).includes(v);
}

// Convenience: export old helpers for backward compat during transition
export const countCompletedItems = countCompletedChecklistItems;
