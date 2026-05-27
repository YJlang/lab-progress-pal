-- Revise the Stage 3.5 (알고리즘 문제 풀이) checklist to reflect the post-BOJ
-- era and shift from a single-platform/quantity-only model to a tiered,
-- platform-agnostic skill model.
--
-- Why: 백준 온라인 저지(BOJ) ended service on 2026-04-28; solved.ac, which
-- depended on BOJ login, is also effectively unusable. The existing
-- "ps_25 / ps_50 / ps_75 / ps_100 / ps_explain" checklist implicitly assumed
-- a single platform with undifferentiated difficulty. The new structure:
--   - ps_easy_25    : 입문 25문제 (Lv.0~1 / Easy)
--   - ps_basic_50   : 기초 50문제 누적 (Lv.1~2 / Easy)
--   - ps_applied_25 : 응용 25문제 누적 (Lv.2 / Medium 일부)
--   - ps_repo       : 풀이 모음 repo 또는 회고 글 1편 이상
--   - ps_explain    : 다양한 접근법(시간/공간 복잡도) 설명
--
-- Mapping policy (meaning-preserving):
--   ps_25       -> ps_easy_25     (25 풀었으면 입문 25는 자연 통과)
--   ps_50       -> ps_basic_50    (50 풀었으면 기초 50 통과)
--   ps_explain  -> ps_explain     (키 동일, 자동 유지)
--   ps_75       -> dropped        (새 구조에 75 개념 없음)
--   ps_100      -> dropped        (100 풀이 ≠ 응용 25 통과)
--   ps_applied_25, ps_repo: 신규 — 학생/관리자가 직접 체크 (자동 false 처리)
--
-- Idempotency: guarded by `NOT (checklist_items->'3.5' ? 'ps_easy_25')`
-- so re-runs are no-ops. Single transaction handled by Supabase runner.

UPDATE public.students
SET checklist_items =
  (checklist_items - '3.5')
  || jsonb_build_object(
       '3.5',
       jsonb_strip_nulls(
         jsonb_build_object(
           'ps_easy_25',  checklist_items -> '3.5' -> 'ps_25',
           'ps_basic_50', checklist_items -> '3.5' -> 'ps_50',
           'ps_explain',  checklist_items -> '3.5' -> 'ps_explain'
         )
       )
     )
WHERE (checklist_items ? '3.5')
  AND NOT ((checklist_items -> '3.5') ? 'ps_easy_25');
