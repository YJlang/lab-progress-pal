// Single source of truth for all progress stages and their checklists.
// Add a stage here and every UI surface updates automatically.

export type StageKey = "1" | "1.5" | "2" | "2.5" | "3" | "3.5" | "4";

export interface ChecklistItem {
  key: string;
  label: string;
}

export interface Stage {
  key: StageKey;
  title: string;
  description: string;
  checklist: ChecklistItem[];
}

export const STAGES: Stage[] = [
  {
    key: "1",
    title: "Stage 1 · Python 기초",
    description:
      "Python 기본 문법을 이해하고 150줄 이내의 간단한 프로그램을 작성·해석할 수 있습니다. (Python Express, 클래스까지)",
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
    title: "Stage 1.5 · C 언어",
    description:
      "함수, 2차원 배열, 구조체, 파일 입출력, 포인터, call by value/reference를 이해하고 150줄 이내 C 프로그램을 작성·해석할 수 있습니다.",
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
    title: "Stage 2 · 외부 기기에서 실행",
    description:
      "개인 PC가 아닌 다른 기기(예: Raspberry Pi)에서 C 또는 Python 프로그램을 실행할 수 있습니다.",
    checklist: [
      { key: "rpi_connect", label: "Raspberry Pi 등 기기에 접속 가능" },
      { key: "rpi_run", label: "기기에서 Python/C 프로그램 실행 가능" },
      { key: "rpi_terminal", label: "기본 터미널 명령어 이해" },
      { key: "rpi_transfer", label: "기기로 파일 전송 가능" },
    ],
  },
  {
    key: "2.5",
    title: "Stage 2.5 · 비 Windows OS",
    description: "Linux, Raspbian 등 Windows가 아닌 운영체제를 설치하고 사용할 수 있습니다.",
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
    title: "Stage 3 · 자료구조와 알고리즘",
    description:
      "스택, 큐, 트리 등 기본 자료구조와 정렬·탐색을 이해하고 재귀와 동적 계획법으로 간단한 문제를 해결할 수 있습니다.",
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
    title: "Stage 3.5 · 알고리즘 문제 풀이",
    description: "쉬운 난이도라도 최소 100문제 이상의 알고리즘 문제를 해결한 경험이 있습니다.",
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
    title: "Stage 4 · 국내 학회 발표",
    description: "2페이지 분량의 국내 학회 논문을 작성하고 최소 포스터 발표 경험이 있습니다.",
    checklist: [
      { key: "paper_topic", label: "연구 주제 선정" },
      { key: "paper_read", label: "관련 논문 읽기" },
      { key: "paper_write", label: "2페이지 논문 작성" },
      { key: "paper_poster", label: "포스터 준비" },
      { key: "paper_present", label: "국내 학회 발표" },
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

/**
 * Total checklist item count across all stages.
 */
export const TOTAL_CHECKLIST_ITEMS = STAGES.reduce(
  (sum, s) => sum + s.checklist.length,
  0,
);

export type ChecklistState = Partial<Record<StageKey, Record<string, boolean>>>;

export function countCompletedItems(checklist: ChecklistState): number {
  let n = 0;
  for (const stage of STAGES) {
    const stageState = checklist[stage.key] ?? {};
    for (const item of stage.checklist) {
      if (stageState[item.key]) n++;
    }
  }
  return n;
}

export function stageCompletion(
  checklist: ChecklistState,
  stageKey: StageKey,
): { done: number; total: number } {
  const stage = STAGE_MAP[stageKey];
  const state = checklist[stageKey] ?? {};
  const done = stage.checklist.filter((i) => state[i.key]).length;
  return { done, total: stage.checklist.length };
}

export function overallProgress(checklist: ChecklistState): number {
  if (TOTAL_CHECKLIST_ITEMS === 0) return 0;
  return Math.round((countCompletedItems(checklist) / TOTAL_CHECKLIST_ITEMS) * 100);
}

export function isStageKey(v: string): v is StageKey {
  return (STAGE_KEYS as string[]).includes(v);
}
