// queries/hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRegularPost,
  getRegularGroups,
  patchJoin,
  postAttend,
  deletePost,
  patchManualAttendance,
  patchFixAttendance,
} from "../apis/regular";
import { qk } from "./keys";

export const useRegularDetail = (postId: string) =>
  useQuery({
    queryKey: qk.regularDetail(postId),
    queryFn: () => getRegularPost(postId),
    // 상세는 탭 전환/뒤로가기에도 재사용되도록
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    // 여기서 필요한 파생 데이터만 뽑아 UI에 전달해도 됨
    select: (d) => d,
    enabled: !!postId,
  });

export const useRegularGroups = (postId: string, enabled: boolean) =>
  useQuery({
    queryKey: qk.regularGroups(postId),
    queryFn: () => getRegularGroups(postId),
    enabled,
    staleTime: 10 * 60_000,
    refetchOnWindowFocus: false,
  });

export const useJoinMutation = (postId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (group?: string) => patchJoin(postId, group),
    // 낙관적 업데이트: 상세 캐시를 직접 수정
    onMutate: async (group) => {
      await qc.cancelQueries({ queryKey: qk.regularDetail(postId) });
      const prev = qc.getQueryData<Awaited<ReturnType<typeof getRegularPost>>>(
        qk.regularDetail(postId),
      );
      if (prev) {
        // 내 상태를 PENDING(or 해제)으로 미리 반영
        const me = prev.userInfo;
        const next = { ...prev };

        // 참여 취소
        if (!group) {
          next.groupedParticipants = next.groupedParticipants.map((g) => ({
            ...g,
            participants:
              g.participants?.filter((p: any) => p.userId !== me.userId) ?? [],
          }));
          next.participants = next.participants.filter(
            (p: any) => p.userId !== me.userId,
          );
          next.participantsNum = Math.max(0, next.participantsNum - 1);
        } else {
          // 기존 그룹에서 제거 후 선택 그룹에 추가
          const removed = next.groupedParticipants.map((g) => ({
            ...g,
            participants:
              g.participants?.filter((p: any) => p.userId !== me.userId) ?? [],
          }));
          const idx = removed.findIndex((g) => g.group === group);
          if (idx >= 0) {
            removed[idx] = {
              ...removed[idx],
              participants: [
                ...(removed[idx].participants ?? []),
                { userId: me.userId, userName: me.userName, status: "PENDING" },
              ],
            };
          }
          next.groupedParticipants = removed;
          // participantsNum은 서버 정의에 맞춰 유지/증가 선택 (여기선 증가)
          if (!prev.participants.some((p: any) => p.userId === me.userId)) {
            next.participants = [
              ...prev.participants,
              { userId: me.userId, userName: me.userName, status: "PENDING" },
            ];
            next.participantsNum = prev.participantsNum + 1;
          }
        }
        qc.setQueryData(qk.regularDetail(postId), next);
      }
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(qk.regularDetail(postId), ctx.prev);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.regularDetail(postId) });
    },
  });
};

export const useAttendMutation = (postId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => postAttend(postId, code),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.regularDetail(postId) });
    },
  });
};

export const useDeletePostMutation = (postId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      qc.removeQueries({ queryKey: qk.regularDetail(postId) });
    },
  });
};

export const useSaveAttendanceMutation = (
  postId: string,
  forClosedAdmin: boolean,
) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { userId: number; isAttend: boolean }[]) =>
      forClosedAdmin
        ? patchFixAttendance(postId, payload)
        : patchManualAttendance(postId, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: qk.regularDetail(postId) }),
  });
};
