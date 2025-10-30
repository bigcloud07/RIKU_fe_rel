import { create } from "zustand";

type Tab = "소개" | "명단";

interface RegularRunUIState {
  activeTab: Tab;
  isModalOpen: boolean;
  code: string;
  showMenu: boolean;
  isEditMode: boolean;
  editedAttendance: Record<number, boolean>;
  setTab: (t: Tab) => void;
  openModal: () => void;
  closeModal: () => void;
  setCode: (c: string) => void;
  toggleMenu: () => void;
  hideMenu: () => void;
  enableEdit: () => void;
  disableEdit: () => void;
  toggleAttendance: (userId: number, originalStatus: string) => void;
  resetEdited: () => void;
}

export const useRegularRunUI = create<RegularRunUIState>((set, get) => ({
  activeTab: "소개",
  isModalOpen: false,
  code: "",
  showMenu: false,
  isEditMode: false,
  editedAttendance: {},

  setTab: (t) => set({ activeTab: t }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setCode: (c) => set({ code: c }),
  toggleMenu: () => set((s) => ({ showMenu: !s.showMenu })),
  hideMenu: () => set({ showMenu: false }),
  enableEdit: () => set({ isEditMode: true }),
  disableEdit: () => set({ isEditMode: false }),
  toggleAttendance: (userId, originalStatus) => {
    const { editedAttendance } = get();
    const current =
      userId in editedAttendance
        ? editedAttendance[userId]
        : originalStatus === "ATTENDED";
    set({ editedAttendance: { ...editedAttendance, [userId]: !current } });
  },
  resetEdited: () => set({ editedAttendance: {} }),
}));
