import defineComponent from "./rules/defineComponent";
import defineSlots from "./rules/defineSlots";
import forwardRef from "./rules/forwardRef";
import useCallback from "./rules/useCallback";
import useEffect from "./rules/useEffect";
import useImperativeHandle from "./rules/useImperativeHandle";
import useMemo from "./rules/useMemo";
import useState from "./rules/useState";

export default {
  rules: {
    defineComponent,
    defineSlots,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
  },
};
