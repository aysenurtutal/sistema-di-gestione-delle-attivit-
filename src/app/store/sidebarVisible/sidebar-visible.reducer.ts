import { createReducer, on } from '@ngrx/store';
import { showSidebar, hideSidebar } from './sidebar-visible.action';

export interface SidebarState {
  visible: boolean;
}

export const initialState: SidebarState = {
  visible: true
};

export const sidebarVisibleReducer = createReducer(
  initialState,
  on(showSidebar, (state) => ({ ...state, visible: true })),
  on(hideSidebar, (state) => ({ ...state, visible: false }))
);
export default sidebarVisibleReducer;
