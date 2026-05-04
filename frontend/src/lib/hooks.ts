// store/hooks.ts
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store/store";

// Use these throughout your app instead of plain useDispatch / useSelector
// This gives you full TypeScript autocomplete on state shape

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
    useSelector(selector);