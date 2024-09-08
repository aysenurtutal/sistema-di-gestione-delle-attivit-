import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectSidebarState = (state: AppState) => state.sidebar;

export const selectSidebarVisible = createSelector(
  selectSidebarState,
  (state) => state.visible
);
