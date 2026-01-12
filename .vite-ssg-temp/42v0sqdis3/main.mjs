var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var _sa, _ta;
import { ClientOnly, ViteReactSSG } from "vite-react-ssg";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import React__default, { useState, Component, useEffect, Suspense } from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X, AlertTriangle, RefreshCw, Plus, Check, Receipt, Trash2, Edit2, Users, ChevronDown, ChevronUp, ShoppingCart, User, Calculator, ArrowRight, CheckCircle, ChevronRight, Circle, FileText, Archive } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTheme } from "next-themes";
import { Toaster as Toaster$2 } from "sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "@radix-ui/react-slot";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { useFormContext, FormProvider, Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as SelectPrimitive from "@radix-ui/react-select";
import { useLocation } from "react-router-dom";
import fastCompare from "react-fast-compare";
import invariant from "invariant";
import shallowEqual from "shallowequal";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1e3;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return __spreadProps(__spreadValues({}, state), {
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      });
    case "UPDATE_TOAST":
      return __spreadProps(__spreadValues({}, state), {
        toasts: state.toasts.map((t) => t.id === action.toast.id ? __spreadValues(__spreadValues({}, t), action.toast) : t)
      });
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return __spreadProps(__spreadValues({}, state), {
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? __spreadProps(__spreadValues({}, t), {
            open: false
          }) : t
        )
      });
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return __spreadProps(__spreadValues({}, state), {
          toasts: []
        });
      }
      return __spreadProps(__spreadValues({}, state), {
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      });
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast(_a) {
  var props = __objRest(_a, []);
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: __spreadProps(__spreadValues({}, props2), { id })
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: __spreadProps(__spreadValues({}, props), {
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    })
  });
  const duration = props.duration || 3e3;
  setTimeout(() => {
    dismiss();
  }, duration);
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return __spreadProps(__spreadValues({}, state), {
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  });
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef((_b, ref) => {
  var _c = _b, { className } = _c, props = __objRest(_c, ["className"]);
  return /* @__PURE__ */ jsx(
    ToastPrimitives.Viewport,
    __spreadValues({
      ref,
      className: cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className
      )
    }, props)
  );
});
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 sm:space-x-4 overflow-hidden rounded-md border p-3 pr-8 sm:p-6 sm:pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef((_d, ref) => {
  var _e = _d, { className, variant } = _e, props = __objRest(_e, ["className", "variant"]);
  return /* @__PURE__ */ jsx(ToastPrimitives.Root, __spreadValues({ ref, className: cn(toastVariants({ variant }), className) }, props));
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef((_f, ref) => {
  var _g = _f, { className } = _g, props = __objRest(_g, ["className"]);
  return /* @__PURE__ */ jsx(
    ToastPrimitives.Action,
    __spreadValues({
      ref,
      className: cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50",
        className
      )
    }, props)
  );
});
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef((_h, ref) => {
  var _i = _h, { className } = _i, props = __objRest(_i, ["className"]);
  return /* @__PURE__ */ jsx(
    ToastPrimitives.Close,
    __spreadProps(__spreadValues({
      ref,
      className: cn(
        "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
        className
      ),
      "toast-close": ""
    }, props), {
      children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
    })
  );
});
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef((_j, ref) => {
  var _k = _j, { className } = _k, props = __objRest(_k, ["className"]);
  return /* @__PURE__ */ jsx(ToastPrimitives.Title, __spreadValues({ ref, className: cn("text-sm font-semibold", className) }, props));
});
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef((_l, ref) => {
  var _m = _l, { className } = _m, props = __objRest(_m, ["className"]);
  return /* @__PURE__ */ jsx(ToastPrimitives.Description, __spreadValues({ ref, className: cn("text-sm opacity-90", className) }, props));
});
ToastDescription.displayName = ToastPrimitives.Description.displayName;
function Toaster$1() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function(_a) {
      var _b = _a, { id, title, description, action } = _b, props = __objRest(_b, ["id", "title", "description", "action"]);
      return /* @__PURE__ */ jsxs(Toast, __spreadProps(__spreadValues({}, props), { children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsx(ToastClose, {})
      ] }), id);
    }),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}
const Toaster = (_n) => {
  var props = __objRest(_n, []);
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$2,
    __spreadValues({
      theme,
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      }
    }, props)
  );
};
const TooltipProvider = TooltipPrimitive.Provider;
const TooltipContent = React.forwardRef((_o, ref) => {
  var _p = _o, { className, sideOffset = 4 } = _p, props = __objRest(_p, ["className", "sideOffset"]);
  return /* @__PURE__ */ jsx(
    TooltipPrimitive.Content,
    __spreadValues({
      ref,
      sideOffset,
      className: cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )
    }, props)
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const Card = React.forwardRef((_q, ref) => {
  var _r = _q, { className } = _r, props = __objRest(_r, ["className"]);
  return /* @__PURE__ */ jsx("div", __spreadValues({ ref, className: cn("rounded-lg border bg-card text-card-foreground shadow-sm", className) }, props));
});
Card.displayName = "Card";
const CardHeader = React.forwardRef(
  (_s, ref) => {
    var _t = _s, { className } = _t, props = __objRest(_t, ["className"]);
    return /* @__PURE__ */ jsx("div", __spreadValues({ ref, className: cn("flex flex-col space-y-1.5 p-6", className) }, props));
  }
);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(
  (_u, ref) => {
    var _v = _u, { className } = _v, props = __objRest(_v, ["className"]);
    return /* @__PURE__ */ jsx("h3", __spreadValues({ ref, className: cn("text-2xl font-semibold leading-none tracking-tight", className) }, props));
  }
);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(
  (_w, ref) => {
    var _x = _w, { className } = _x, props = __objRest(_x, ["className"]);
    return /* @__PURE__ */ jsx("p", __spreadValues({ ref, className: cn("text-sm text-muted-foreground", className) }, props));
  }
);
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(
  (_y, ref) => {
    var _z = _y, { className } = _z, props = __objRest(_z, ["className"]);
    return /* @__PURE__ */ jsx("div", __spreadValues({ ref, className: cn("p-6 pt-0", className) }, props));
  }
);
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(
  (_A, ref) => {
    var _B = _A, { className } = _B, props = __objRest(_B, ["className"]);
    return /* @__PURE__ */ jsx("div", __spreadValues({ ref, className: cn("flex items-center p-6 pt-0", className) }, props));
  }
);
CardFooter.displayName = "CardFooter";
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant transition-smooth",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-card hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-elegant transition-smooth",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-elegant transition-smooth"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  (_C, ref) => {
    var _D = _C, { className, variant, size, asChild = false } = _D, props = __objRest(_D, ["className", "variant", "size", "asChild"]);
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, __spreadValues({ className: cn(buttonVariants({ variant, size, className })), ref }, props));
  }
);
Button.displayName = "Button";
class ErrorBoundary extends React__default.Component {
  constructor(props) {
    super(props);
    __publicField(this, "resetError", () => {
      this.setState({ hasError: false, error: void 0 });
    });
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return /* @__PURE__ */ jsx(FallbackComponent, { error: this.state.error, resetError: this.resetError });
      }
      return /* @__PURE__ */ jsx(DefaultErrorFallback, { error: this.state.error, resetError: this.resetError });
    }
    return this.props.children;
  }
}
const DefaultErrorFallback = ({ error, resetError }) => {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20", children: /* @__PURE__ */ jsx(Card, { className: "p-6 max-w-md w-full text-center shadow-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "p-3 rounded-full bg-destructive/10", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-8 w-8 text-destructive" }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-destructive mb-2", children: "Something went wrong" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "We encountered an unexpected error. Don't worry, your data is safe." }),
      error && process.env.NODE_ENV === "development" && /* @__PURE__ */ jsxs("details", { className: "text-left mb-4", children: [
        /* @__PURE__ */ jsx("summary", { className: "text-xs text-muted-foreground cursor-pointer", children: "Error details (dev mode)" }),
        /* @__PURE__ */ jsx("pre", { className: "text-xs bg-muted p-2 rounded mt-2 overflow-auto", children: error.message })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 w-full", children: [
      /* @__PURE__ */ jsxs(Button, { onClick: resetError, className: "flex-1", children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4 mr-2" }),
        "Try Again"
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          onClick: () => window.location.reload(),
          className: "flex-1",
          children: "Reload Page"
        }
      )
    ] })
  ] }) }) });
};
const Input = React.forwardRef(
  (_E, ref) => {
    var _F = _E, { className, type } = _F, props = __objRest(_F, ["className", "type"]);
    return /* @__PURE__ */ jsx(
      "input",
      __spreadValues({
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref
      }, props)
    );
  }
);
Input.displayName = "Input";
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge(_G) {
  var _H = _G, { className, variant } = _H, props = __objRest(_H, ["className", "variant"]);
  return /* @__PURE__ */ jsx("div", __spreadValues({ className: cn(badgeVariants({ variant }), className) }, props));
}
const BillHeader = ({ participants, onAddParticipant, onRemoveParticipant }) => {
  const [newParticipant, setNewParticipant] = useState("");
  const handleAdd = () => {
    const trimmedName = newParticipant.trim();
    if (trimmedName && !participants.includes(trimmedName)) {
      onAddParticipant(trimmedName);
      setNewParticipant("");
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-4", children: "Participants" }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-4", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          placeholder: "Add person...",
          value: newParticipant,
          onChange: (e) => setNewParticipant(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && handleAdd(),
          className: "h-10 bg-white border-border/60 focus:ring-primary/20 transition-all font-medium"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: handleAdd,
          disabled: !newParticipant.trim(),
          size: "icon",
          className: "h-10 w-10 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all",
          children: /* @__PURE__ */ jsx(Plus, { className: "h-5 w-5" })
        }
      )
    ] }),
    participants.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-6 border border-dashed border-border/60 rounded-lg bg-neutral-50/50", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Add people to start splitting" }) }) : /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1", children: participants.map((participant) => /* @__PURE__ */ jsxs(
      Badge,
      {
        variant: "secondary",
        className: "pl-3 pr-1 py-1.5 h-8 gap-1 bg-white border border-border/50 hover:bg-neutral-50 hover:border-border text-foreground transition-all cursor-default group",
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: participant }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onRemoveParticipant(participant),
              className: "h-5 w-5 rounded-full flex items-center justify-center hover:bg-neutral-200 text-muted-foreground hover:text-foreground transition-colors ml-1",
              children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
            }
          )
        ]
      },
      participant
    )) })
  ] }) });
};
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef((_I, ref) => {
  var _J = _I, { className } = _J, props = __objRest(_J, ["className"]);
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Overlay,
    __spreadValues({
      ref,
      className: cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )
    }, props)
  );
});
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef((_K, ref) => {
  var _L = _K, { className, children } = _L, props = __objRest(_L, ["className", "children"]);
  return /* @__PURE__ */ jsxs(DialogPortal, { children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      __spreadProps(__spreadValues({
        ref,
        className: cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )
      }, props), {
        children: [
          children,
          /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      })
    )
  ] });
});
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = (_M) => {
  var _N = _M, { className } = _N, props = __objRest(_N, ["className"]);
  return /* @__PURE__ */ jsx("div", __spreadValues({ className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className) }, props));
};
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef((_O, ref) => {
  var _P = _O, { className } = _P, props = __objRest(_P, ["className"]);
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Title,
    __spreadValues({
      ref,
      className: cn("text-lg font-semibold leading-none tracking-tight", className)
    }, props)
  );
});
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef((_Q, ref) => {
  var _R = _Q, { className } = _R, props = __objRest(_R, ["className"]);
  return /* @__PURE__ */ jsx(DialogPrimitive.Description, __spreadValues({ ref, className: cn("text-sm text-muted-foreground", className) }, props));
});
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = React.forwardRef((_S, ref) => {
  var _T = _S, { className } = _T, props = __objRest(_T, ["className"]);
  return /* @__PURE__ */ jsx(LabelPrimitive.Root, __spreadValues({ ref, className: cn(labelVariants(), className) }, props));
});
Label.displayName = LabelPrimitive.Root.displayName;
const Checkbox = React.forwardRef((_U, ref) => {
  var _V = _U, { className } = _V, props = __objRest(_V, ["className"]);
  return /* @__PURE__ */ jsx(
    CheckboxPrimitive.Root,
    __spreadProps(__spreadValues({
      ref,
      className: cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx(CheckboxPrimitive.Indicator, { className: cn("flex items-center justify-center text-current"), children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
    })
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
const toCents = (amount, decimals = 2) => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(amount * multiplier);
};
const fromCents = (cents, decimals = 2) => {
  const divisor = Math.pow(10, decimals);
  return cents / divisor;
};
const formatCurrency = (amount, currency, locale) => {
  const userLocale = navigator.language || "en-US";
  try {
    const formatter = new Intl.NumberFormat(userLocale, {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: currency.decimals || 2,
      maximumFractionDigits: currency.decimals || 2
    });
    return formatter.format(amount);
  } catch (error) {
    const decimals = currency.decimals || 2;
    return `${currency.symbol}${amount.toFixed(decimals)}`;
  }
};
const parseCurrency = (value) => {
  if (typeof value === "number") {
    if (isNaN(value)) return 0;
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
  const cleaned = value.replace(/[^\d.-]/g, "");
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return 0;
  let result = Math.round((parsed + Number.EPSILON) * 100) / 100;
  const nearestWhole = Math.round(result);
  if (Math.abs(result - nearestWhole) < 0.01) {
    result = nearestWhole;
  }
  return result;
};
const sanitizeMonetaryData = (data) => {
  if (typeof data === "number") {
    let result = Math.round((data + Number.EPSILON) * 100) / 100;
    const nearestWhole = Math.round(result);
    if (Math.abs(result - nearestWhole) < 0.01) {
      result = nearestWhole;
    }
    return result;
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeMonetaryData);
  }
  if (data && typeof data === "object") {
    const result = {};
    const obj = data;
    for (const [key, value] of Object.entries(obj)) {
      if (["price", "amount", "total", "consumed", "paid", "balance", "netBalance"].includes(key)) {
        result[key] = sanitizeMonetaryData(value);
      } else {
        result[key] = sanitizeMonetaryData(value);
      }
    }
    return result;
  }
  return data;
};
const cleanStorageData = (storageKey) => {
  try {
    const data = localStorage.getItem(storageKey);
    if (data) {
      const parsed = JSON.parse(data);
      const sanitized = sanitizeMonetaryData(parsed);
      localStorage.setItem(storageKey, JSON.stringify(sanitized));
    }
  } catch (error) {
    console.warn("Failed to clean storage data:", error);
  }
};
const divideAmount = (totalAmount, participantCount, decimals = 2) => {
  if (participantCount <= 0) return [];
  const totalCents = toCents(totalAmount, decimals);
  const baseCents = Math.floor(totalCents / participantCount);
  const remainder = totalCents % participantCount;
  const amounts = [];
  for (let i = 0; i < participantCount; i++) {
    const cents = baseCents + (i < remainder ? 1 : 0);
    amounts.push(fromCents(cents, decimals));
  }
  return amounts;
};
const sumAmounts = (amounts, decimals = 2) => {
  const totalCents = amounts.reduce((sum, amount) => sum + toCents(amount, decimals), 0);
  return fromCents(totalCents, decimals);
};
const EditItemDialog = ({ item, participants, onSave, currency }) => {
  const [isSharedByAll, setIsSharedByAll] = useState(item.assignedTo.length === 0);
  const [selectedParticipants, setSelectedParticipants] = useState(
    item.assignedTo.length === 0 ? item.participantsAtTime : item.assignedTo
  );
  const [open, setOpen] = useState(false);
  const toggleParticipant = (participant) => {
    setSelectedParticipants(
      (prev) => prev.includes(participant) ? prev.filter((p) => p !== participant) : [...prev, participant]
    );
  };
  const handleSave = () => {
    const updatedAssignedTo = isSharedByAll ? [] : selectedParticipants;
    const updatedParticipantsAtTime = isSharedByAll ? selectedParticipants : item.participantsAtTime;
    onSave({
      assignedTo: updatedAssignedTo,
      participantsAtTime: updatedParticipantsAtTime
    });
    setOpen(false);
  };
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        className: "text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-1",
        children: [
          /* @__PURE__ */ jsx(Edit2, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs hidden sm:inline", children: "Edit" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [
        "Edit Item: ",
        item.name
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-gray-50 p-3 rounded-lg", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
          /* @__PURE__ */ jsx("strong", { children: "Price:" }),
          " ",
          currency.symbol,
          item.price,
          " • ",
          /* @__PURE__ */ jsx("strong", { children: "Paid by:" }),
          " ",
          item.paidBy
        ] }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium text-gray-700", children: "Who consumed this item?" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  id: "edit-shared-all",
                  checked: isSharedByAll,
                  onCheckedChange: (checked) => {
                    setIsSharedByAll(!!checked);
                    if (checked) {
                      setSelectedParticipants([...participants]);
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsxs(Label, { htmlFor: "edit-shared-all", className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
                "Shared by selected people"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium text-gray-600", children: "Select participants:" }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: participants.map((participant) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    id: `edit-participant-${participant}`,
                    checked: selectedParticipants.includes(participant),
                    onCheckedChange: () => toggleParticipant(participant)
                  }
                ),
                /* @__PURE__ */ jsx(Label, { htmlFor: `edit-participant-${participant}`, className: "text-sm", children: participant })
              ] }, participant)) })
            ] }),
            selectedParticipants.length > 0 && /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600 bg-blue-50 p-3 rounded-lg", children: [
              /* @__PURE__ */ jsx("strong", { children: "New split:" }),
              " ",
              divideAmount(item.price, selectedParticipants.length).map((amount) => formatCurrency(amount, currency)).join(", "),
              " per person",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("strong", { children: "Participants:" }),
              " ",
              selectedParticipants.join(", ")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-4", children: [
          /* @__PURE__ */ jsx(Button, { onClick: handleSave, disabled: selectedParticipants.length === 0, className: "flex-1", children: "Save Changes" }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setOpen(false), children: "Cancel" })
        ] })
      ] })
    ] })
  ] });
};
const ItemList = ({ items, participants, onRemoveItem, onEditItem, currency, formatCurrency: formatCurrency2 }) => {
  const totalAmount = sumAmounts(items.map((item) => item.price));
  items.length > 0;
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden animate-fade-in", "aria-label": "Bill Items List", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-border/50 flex justify-between items-center bg-neutral-50/30", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold tracking-wide uppercase text-muted-foreground", children: "Items" }) }),
      /* @__PURE__ */ jsx("div", { children: items.length > 0 && /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-muted-foreground", children: [
        items.length,
        " items"
      ] }) })
    ] }),
    items.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12 px-6", children: [
      /* @__PURE__ */ jsx(Receipt, { className: "h-8 w-8 text-neutral-300 mx-auto mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-neutral-900 font-medium", children: "No items yet" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground max-w-xs mx-auto mt-1", children: "Added items will appear here." })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "divide-y divide-border/50", children: [
      items.map((item, index) => {
        const assignedTo = item.assignedTo.length === 0 ? item.participantsAtTime : item.assignedTo;
        const assignedCount = assignedTo.length;
        const dividedAmounts = assignedCount > 0 ? divideAmount(item.price, assignedCount) : [0];
        const sharePerPerson = dividedAmounts.length > 0 ? dividedAmounts[0] : 0;
        return /* @__PURE__ */ jsxs("div", { className: "group p-4 hover:bg-neutral-50/50 transition-colors flex items-start gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-medium text-neutral-900 truncate pr-2", children: item.name }),
              /* @__PURE__ */ jsx("span", { className: "font-mono font-medium text-neutral-900", children: formatCurrency2(item.price) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground/70", children: "Paid by" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-neutral-700", children: item.paidBy })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground/70", children: "For" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-neutral-700", children: item.assignedTo.length === 0 ? "Everyone" : item.assignedTo.length > 3 ? `${item.assignedTo.length} people` : item.assignedTo.join(", ") })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 ml-auto sm:ml-0", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground/70", children: "Split" }),
                /* @__PURE__ */ jsxs("span", { className: "font-mono text-neutral-700", children: [
                  formatCurrency2(sharePerPerson),
                  "/ea"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity self-center", children: [
            /* @__PURE__ */ jsx(
              EditItemDialog,
              {
                item,
                participants,
                onSave: (updatedItem) => onEditItem(item.id, updatedItem),
                currency
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: () => onRemoveItem(item.id),
                className: "h-8 w-8 text-neutral-400 hover:text-destructive hover:bg-destructive/10",
                children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }, item.id);
      }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 bg-neutral-50/50 flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Total" }),
        /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-lg text-primary", children: formatCurrency2(totalAmount) })
      ] })
    ] })
  ] });
};
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef((_W, ref) => {
  var _X = _W, { className, children } = _X, props = __objRest(_X, ["className", "children"]);
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Trigger,
    __spreadProps(__spreadValues({
      ref,
      className: cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      )
    }, props), {
      children: [
        children,
        /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
      ]
    })
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef((_Y, ref) => {
  var _Z = _Y, { className } = _Z, props = __objRest(_Z, ["className"]);
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollUpButton,
    __spreadProps(__spreadValues({
      ref,
      className: cn("flex cursor-default items-center justify-center py-1", className)
    }, props), {
      children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
    })
  );
});
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef((__, ref) => {
  var _$ = __, { className } = _$, props = __objRest(_$, ["className"]);
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollDownButton,
    __spreadProps(__spreadValues({
      ref,
      className: cn("flex cursor-default items-center justify-center py-1", className)
    }, props), {
      children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
    })
  );
});
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef((_aa, ref) => {
  var _ba = _aa, { className, children, position = "popper" } = _ba, props = __objRest(_ba, ["className", "children", "position"]);
  return /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    SelectPrimitive.Content,
    __spreadProps(__spreadValues({
      ref,
      className: cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position
    }, props), {
      children: [
        /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(SelectScrollDownButton, {})
      ]
    })
  ) });
});
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef((_ca, ref) => {
  var _da = _ca, { className } = _da, props = __objRest(_da, ["className"]);
  return /* @__PURE__ */ jsx(SelectPrimitive.Label, __spreadValues({ ref, className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className) }, props));
});
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef((_ea, ref) => {
  var _fa = _ea, { className, children } = _fa, props = __objRest(_fa, ["className", "children"]);
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Item,
    __spreadProps(__spreadValues({
      ref,
      className: cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
      ]
    })
  );
});
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef((_ga, ref) => {
  var _ha = _ga, { className } = _ha, props = __objRest(_ha, ["className"]);
  return /* @__PURE__ */ jsx(SelectPrimitive.Separator, __spreadValues({ ref, className: cn("-mx-1 my-1 h-px bg-muted", className) }, props));
});
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
const Form = FormProvider;
const FormFieldContext = React.createContext({});
const FormField = (_ia) => {
  var props = __objRest(_ia, []);
  return /* @__PURE__ */ jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsx(Controller, __spreadValues({}, props)) });
};
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return __spreadValues({
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`
  }, fieldState);
};
const FormItemContext = React.createContext({});
const FormItem = React.forwardRef(
  (_ja, ref) => {
    var _ka = _ja, { className } = _ka, props = __objRest(_ka, ["className"]);
    const id = React.useId();
    return /* @__PURE__ */ jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsx("div", __spreadValues({ ref, className: cn("space-y-2", className) }, props)) });
  }
);
FormItem.displayName = "FormItem";
const FormLabel = React.forwardRef((_la, ref) => {
  var _ma = _la, { className } = _ma, props = __objRest(_ma, ["className"]);
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx(Label, __spreadValues({ ref, className: cn(error && "text-destructive", className), htmlFor: formItemId }, props));
});
FormLabel.displayName = "FormLabel";
const FormControl = React.forwardRef(
  (_na, ref) => {
    var props = __objRest(_na, []);
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
    return /* @__PURE__ */ jsx(
      Slot,
      __spreadValues({
        ref,
        id: formItemId,
        "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
        "aria-invalid": !!error
      }, props)
    );
  }
);
FormControl.displayName = "FormControl";
const FormDescription = React.forwardRef(
  (_oa, ref) => {
    var _pa = _oa, { className } = _pa, props = __objRest(_pa, ["className"]);
    const { formDescriptionId } = useFormField();
    return /* @__PURE__ */ jsx("p", __spreadValues({ ref, id: formDescriptionId, className: cn("text-sm text-muted-foreground", className) }, props));
  }
);
FormDescription.displayName = "FormDescription";
const FormMessage = React.forwardRef(
  (_qa, ref) => {
    var _ra = _qa, { className, children } = _ra, props = __objRest(_ra, ["className", "children"]);
    const { error, formMessageId } = useFormField();
    const body = error ? String(error == null ? void 0 : error.message) : children;
    if (!body) {
      return null;
    }
    return /* @__PURE__ */ jsx("p", __spreadProps(__spreadValues({ ref, id: formMessageId, className: cn("text-sm font-medium text-destructive", className) }, props), { children: body }));
  }
);
FormMessage.displayName = "FormMessage";
const parseCurrencyValue = (val) => parseCurrency(val);
const formSchema = z.object({
  itemName: z.string().min(2, "Item name must be at least 2 characters").max(50),
  itemPrice: z.string().refine((val) => {
    const parsed = parseCurrencyValue(val);
    return parsed > 0;
  }, "Price must be greater than 0"),
  paidBy: z.string().min(1, "Please select who paid"),
  isSharedByAll: z.boolean().default(true),
  selectedParticipants: z.array(z.string()).default([])
}).refine((data) => {
  if (!data.isSharedByAll && data.selectedParticipants.length === 0) {
    return false;
  }
  return true;
}, {
  message: "Select at least one participant",
  path: ["selectedParticipants"]
});
const AddItemForm = ({ participants, onAddItem, currency }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: "",
      itemPrice: "",
      paidBy: "",
      isSharedByAll: true,
      selectedParticipants: []
    }
  });
  const watchedPrice = form.watch("itemPrice");
  const watchedIsSharedByAll = form.watch("isSharedByAll");
  const watchedSelectedParticipants = form.watch("selectedParticipants");
  const onSubmit = (values) => {
    const price = parseCurrencyValue(values.itemPrice);
    const sanitizedPrice = Math.round((price + Number.EPSILON) * 100) / 100;
    onAddItem({
      name: values.itemName.trim(),
      price: sanitizedPrice,
      assignedTo: values.isSharedByAll ? [] : values.selectedParticipants,
      paidBy: values.paidBy,
      participantsAtTime: [...participants]
    });
    form.reset({
      itemName: "",
      itemPrice: "",
      paidBy: "",
      // Maybe keep the same payer? Standard UX to clear though.
      isSharedByAll: true,
      selectedParticipants: []
    });
  };
  participants.length > 0;
  if (participants.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "p-8 text-center bg-white rounded-xl border border-dashed border-border/60", children: [
      /* @__PURE__ */ jsx(ShoppingCart, { className: "h-8 w-8 text-neutral-300 mx-auto mb-3" }),
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-neutral-900", children: "Add Items" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto", children: "Start by adding participants above, then you can add items here." })
    ] });
  }
  const splitCount = watchedIsSharedByAll ? participants.length : watchedSelectedParticipants.length;
  const priceValue = parseCurrencyValue(watchedPrice);
  splitCount > 0 && priceValue > 0 ? divideAmount(priceValue, splitCount)[0] : 0;
  return /* @__PURE__ */ jsxs("div", { className: "p-6 bg-white animate-fade-in", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-1", children: "Add New Item" }) }),
    /* @__PURE__ */ jsx(Form, __spreadProps(__spreadValues({}, form), { children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "itemName",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                __spreadProps(__spreadValues({
                  placeholder: "Item name (e.g. Pizza)"
                }, field), {
                  className: "h-12 text-lg bg-transparent border-0 border-b border-border/60 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/50 transition-colors",
                  autoComplete: "off"
                })
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "itemPrice",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxs(FormLabel, { className: "text-xs text-muted-foreground", children: [
                  "Price (",
                  currency.symbol,
                  ")"
                ] }),
                /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                  Input,
                  __spreadProps(__spreadValues({
                    type: "number",
                    step: "0.01",
                    min: "0",
                    inputMode: "decimal",
                    placeholder: "0.00"
                  }, field), {
                    className: "h-10 font-mono text-base bg-neutral-50 border-transparent focus:bg-white focus:border-border transition-colors"
                  })
                ) }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "paidBy",
              render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
                /* @__PURE__ */ jsx(FormLabel, { className: "text-xs text-muted-foreground", children: "Paid by" }),
                /* @__PURE__ */ jsxs(Select, { onValueChange: field.onChange, value: field.value, children: [
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { className: "h-10 bg-neutral-50 border-transparent focus:bg-white focus:border-border transition-colors", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select..." }) }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: participants.map((participant) => /* @__PURE__ */ jsx(SelectItem, { value: participant, children: participant }, participant)) })
                ] }),
                /* @__PURE__ */ jsx(FormMessage, {})
              ] })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "isSharedByAll",
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { className: "space-y-3", children: [
              /* @__PURE__ */ jsx(FormLabel, { className: "text-xs text-muted-foreground block", children: "Applies to" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: cn(
                      "cursor-pointer rounded-lg border p-3 flex items-center justify-center gap-2 transition-all text-sm font-medium",
                      field.value ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-white border-border/60 text-muted-foreground hover:bg-neutral-50 hover:border-border"
                    ),
                    onClick: () => field.onChange(true),
                    children: [
                      /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
                      /* @__PURE__ */ jsx("span", { children: "Everyone" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: cn(
                      "cursor-pointer rounded-lg border p-3 flex items-center justify-center gap-2 transition-all text-sm font-medium",
                      !field.value ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-white border-border/60 text-muted-foreground hover:bg-neutral-50 hover:border-border"
                    ),
                    onClick: () => field.onChange(false),
                    children: [
                      /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }),
                      /* @__PURE__ */ jsx("span", { children: "Specific" })
                    ]
                  }
                )
              ] })
            ] })
          }
        ),
        !watchedIsSharedByAll && /* @__PURE__ */ jsx("div", { className: "animate-in fade-in slide-in-from-top-1 px-1 py-3", children: /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: "selectedParticipants",
            render: () => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: participants.map((participant) => /* @__PURE__ */ jsx(
                FormField,
                {
                  control: form.control,
                  name: "selectedParticipants",
                  render: ({ field }) => {
                    var _a;
                    return /* @__PURE__ */ jsx(
                      FormItem,
                      {
                        className: "space-y-0",
                        children: /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: cn(
                              "px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all border select-none",
                              ((_a = field.value) == null ? void 0 : _a.includes(participant)) ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-muted-foreground border-border hover:border-neutral-400"
                            ),
                            onClick: () => {
                              var _a2, _b;
                              if ((_a2 = field.value) == null ? void 0 : _a2.includes(participant)) {
                                field.onChange((_b = field.value) == null ? void 0 : _b.filter((value) => value !== participant));
                              } else {
                                field.onChange([...field.value || [], participant]);
                              }
                            },
                            children: participant
                          }
                        ) })
                      },
                      participant
                    );
                  }
                },
                participant
              )) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          size: "lg",
          className: "w-full h-12 text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 rounded-lg",
          children: "Add Item"
        }
      )
    ] }) }))
  ] });
};
const SettlementSummary = ({ items, participants, currency, formatCurrency: formatCurrency2 }) => {
  const [showDetailedView, setShowDetailedView] = useState(false);
  const roundToTwo = (num) => {
    return fromCents(toCents(num));
  };
  const calculateShares = () => {
    const shares2 = {};
    participants.forEach((participant) => {
      shares2[participant] = {
        name: participant,
        consumed: 0,
        paid: 0,
        total: 0,
        netBalance: 0
      };
    });
    items.forEach((item) => {
      const assignedTo = item.assignedTo.length === 0 ? item.participantsAtTime : item.assignedTo;
      const dividedAmounts = divideAmount(item.price, assignedTo.length);
      assignedTo.forEach((participant, index) => {
        if (shares2[participant]) {
          shares2[participant].consumed += dividedAmounts[index] || 0;
        }
      });
      if (shares2[item.paidBy]) {
        shares2[item.paidBy].paid += item.price;
      }
    });
    participants.forEach((participant) => {
      shares2[participant].consumed = roundToTwo(shares2[participant].consumed);
      shares2[participant].paid = roundToTwo(shares2[participant].paid);
      shares2[participant].total = shares2[participant].consumed;
      shares2[participant].netBalance = roundToTwo(shares2[participant].paid - shares2[participant].total);
    });
    return Object.values(shares2);
  };
  const shares = calculateShares();
  const billTotal = sumAmounts(items.map((item) => item.price));
  const calculatePaymentAdjustments = () => {
    const adjustments = [];
    const EPSILON = 5e-3;
    const debtors = shares.filter((s) => s.netBalance < -EPSILON).map((s) => ({
      name: s.name,
      amount: roundToTwo(-s.netBalance)
    }));
    const creditors = shares.filter((s) => s.netBalance > EPSILON).map((s) => ({
      name: s.name,
      amount: roundToTwo(s.netBalance)
    }));
    const workingDebtors = [...debtors];
    const workingCreditors = [...creditors];
    let debtorIndex = 0;
    let creditorIndex = 0;
    while (debtorIndex < workingDebtors.length && creditorIndex < workingCreditors.length) {
      const debtor = workingDebtors[debtorIndex];
      const creditor = workingCreditors[creditorIndex];
      const paymentAmount = roundToTwo(Math.min(debtor.amount, creditor.amount));
      if (paymentAmount > EPSILON) {
        adjustments.push({
          from: debtor.name,
          to: creditor.name,
          amount: paymentAmount
        });
      }
      debtor.amount = roundToTwo(debtor.amount - paymentAmount);
      creditor.amount = roundToTwo(creditor.amount - paymentAmount);
      if (debtor.amount < EPSILON) debtorIndex++;
      if (creditor.amount < EPSILON) creditorIndex++;
    }
    return adjustments;
  };
  const paymentAdjustments = calculatePaymentAdjustments();
  participants.length > 0 && items.length > 0;
  if (participants.length === 0 || items.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-neutral-50 rounded-xl border border-dashed border-border/60 p-8 text-center", children: [
      /* @__PURE__ */ jsx(Calculator, { className: "h-8 w-8 text-neutral-300 mx-auto mb-3" }),
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-neutral-900", children: "Settlement" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Calculations will appear here" })
    ] });
  }
  const hasPayments = paymentAdjustments.length > 0;
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-xl shadow-neutral-100 border border-border/50 overflow-hidden animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 pb-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-primary", children: "Settlement" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => setShowDetailedView(!showDetailedView),
            className: "text-xs text-muted-foreground hover:text-primary",
            children: showDetailedView ? "Hide Details" : "Show Details"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground font-medium mb-1", children: "Total Bill" }),
        /* @__PURE__ */ jsxs("div", { className: "text-4xl font-bold tracking-tight text-primary font-display flex items-baseline gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-2xl text-muted-foreground font-medium self-start mt-1", children: currency.symbol }),
          formatCurrency2(billTotal).replace(/[^0-9.,]/g, "")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-neutral-50/50 p-6 border-t border-border/50", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4", children: "Payments Required" }),
      hasPayments ? /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: paymentAdjustments.map((adjustment, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between bg-white p-3 rounded-lg border border-border/40 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-sm text-neutral-900", children: adjustment.from }),
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3 text-muted-foreground/50" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-sm text-neutral-900", children: adjustment.to })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-sm text-primary", children: formatCurrency2(adjustment.amount) })
      ] }, index)) }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg text-emerald-700 text-sm font-medium", children: [
        /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 mr-2" }),
        "All settled up!"
      ] })
    ] }),
    showDetailedView && /* @__PURE__ */ jsxs("div", { className: "p-6 border-t border-border/50 animate-in slide-in-from-top-2", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4", children: "Breakdown" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: shares.map((share) => {
        const EPSILON = 5e-3;
        const isCreditor = share.netBalance > EPSILON;
        const isDebtor = share.netBalance < -EPSILON;
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm py-2 border-b border-border/40 last:border-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-neutral-900", children: share.name }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "Consumed: ",
              formatCurrency2(share.consumed)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxs("span", { className: cn(
              "font-mono font-medium block",
              isCreditor ? "text-emerald-600" : isDebtor ? "text-red-600" : "text-muted-foreground"
            ), children: [
              isCreditor ? "+" : "",
              formatCurrency2(share.netBalance)
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground block", children: [
              "Paid: ",
              formatCurrency2(share.paid)
            ] })
          ] })
        ] }, share.name);
      }) })
    ] })
  ] });
};
var TAG_NAMES = /* @__PURE__ */ ((TAG_NAMES2) => {
  TAG_NAMES2["BASE"] = "base";
  TAG_NAMES2["BODY"] = "body";
  TAG_NAMES2["HEAD"] = "head";
  TAG_NAMES2["HTML"] = "html";
  TAG_NAMES2["LINK"] = "link";
  TAG_NAMES2["META"] = "meta";
  TAG_NAMES2["NOSCRIPT"] = "noscript";
  TAG_NAMES2["SCRIPT"] = "script";
  TAG_NAMES2["STYLE"] = "style";
  TAG_NAMES2["TITLE"] = "title";
  TAG_NAMES2["FRAGMENT"] = "Symbol(react.fragment)";
  return TAG_NAMES2;
})(TAG_NAMES || {});
var SEO_PRIORITY_TAGS = {
  link: { rel: ["amphtml", "canonical", "alternate"] },
  script: { type: ["application/ld+json"] },
  meta: {
    charset: "",
    name: ["generator", "robots", "description"],
    property: [
      "og:type",
      "og:title",
      "og:url",
      "og:image",
      "og:image:alt",
      "og:description",
      "twitter:url",
      "twitter:title",
      "twitter:description",
      "twitter:image",
      "twitter:image:alt",
      "twitter:card",
      "twitter:site"
    ]
  }
};
var VALID_TAG_NAMES = Object.values(TAG_NAMES);
var REACT_TAG_MAP = {
  accesskey: "accessKey",
  charset: "charSet",
  class: "className",
  contenteditable: "contentEditable",
  contextmenu: "contextMenu",
  "http-equiv": "httpEquiv",
  itemprop: "itemProp",
  tabindex: "tabIndex"
};
var HTML_TAG_MAP = Object.entries(REACT_TAG_MAP).reduce(
  (carry, [key, value]) => {
    carry[value] = key;
    return carry;
  },
  {}
);
var HELMET_ATTRIBUTE = "data-rh";
var HELMET_PROPS = {
  DEFAULT_TITLE: "defaultTitle",
  DEFER: "defer",
  ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters",
  ON_CHANGE_CLIENT_STATE: "onChangeClientState",
  TITLE_TEMPLATE: "titleTemplate",
  PRIORITIZE_SEO_TAGS: "prioritizeSeoTags"
};
var getInnermostProperty = (propsList, property) => {
  for (let i = propsList.length - 1; i >= 0; i -= 1) {
    const props = propsList[i];
    if (Object.prototype.hasOwnProperty.call(props, property)) {
      return props[property];
    }
  }
  return null;
};
var getTitleFromPropsList = (propsList) => {
  let innermostTitle = getInnermostProperty(
    propsList,
    "title"
    /* TITLE */
  );
  const innermostTemplate = getInnermostProperty(propsList, HELMET_PROPS.TITLE_TEMPLATE);
  if (Array.isArray(innermostTitle)) {
    innermostTitle = innermostTitle.join("");
  }
  if (innermostTemplate && innermostTitle) {
    return innermostTemplate.replace(/%s/g, () => innermostTitle);
  }
  const innermostDefaultTitle = getInnermostProperty(propsList, HELMET_PROPS.DEFAULT_TITLE);
  return innermostTitle || innermostDefaultTitle || void 0;
};
var getOnChangeClientState = (propsList) => getInnermostProperty(propsList, HELMET_PROPS.ON_CHANGE_CLIENT_STATE) || (() => {
});
var getAttributesFromPropsList = (tagType, propsList) => propsList.filter((props) => typeof props[tagType] !== "undefined").map((props) => props[tagType]).reduce((tagAttrs, current) => __spreadValues(__spreadValues({}, tagAttrs), current), {});
var getBaseTagFromPropsList = (primaryAttributes, propsList) => propsList.filter((props) => typeof props[
  "base"
  /* BASE */
] !== "undefined").map((props) => props[
  "base"
  /* BASE */
]).reverse().reduce((innermostBaseTag, tag) => {
  if (!innermostBaseTag.length) {
    const keys = Object.keys(tag);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const lowerCaseAttributeKey = attributeKey.toLowerCase();
      if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && tag[lowerCaseAttributeKey]) {
        return innermostBaseTag.concat(tag);
      }
    }
  }
  return innermostBaseTag;
}, []);
var warn = (msg) => console && typeof console.warn === "function" && console.warn(msg);
var getTagsFromPropsList = (tagName, primaryAttributes, propsList) => {
  const approvedSeenTags = {};
  return propsList.filter((props) => {
    if (Array.isArray(props[tagName])) {
      return true;
    }
    if (typeof props[tagName] !== "undefined") {
      warn(
        `Helmet: ${tagName} should be of type "Array". Instead found type "${typeof props[tagName]}"`
      );
    }
    return false;
  }).map((props) => props[tagName]).reverse().reduce((approvedTags, instanceTags) => {
    const instanceSeenTags = {};
    instanceTags.filter((tag) => {
      let primaryAttributeKey;
      const keys2 = Object.keys(tag);
      for (let i = 0; i < keys2.length; i += 1) {
        const attributeKey = keys2[i];
        const lowerCaseAttributeKey = attributeKey.toLowerCase();
        if (primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 && !(primaryAttributeKey === "rel" && tag[primaryAttributeKey].toLowerCase() === "canonical") && !(lowerCaseAttributeKey === "rel" && tag[lowerCaseAttributeKey].toLowerCase() === "stylesheet")) {
          primaryAttributeKey = lowerCaseAttributeKey;
        }
        if (primaryAttributes.indexOf(attributeKey) !== -1 && (attributeKey === "innerHTML" || attributeKey === "cssText" || attributeKey === "itemprop")) {
          primaryAttributeKey = attributeKey;
        }
      }
      if (!primaryAttributeKey || !tag[primaryAttributeKey]) {
        return false;
      }
      const value = tag[primaryAttributeKey].toLowerCase();
      if (!approvedSeenTags[primaryAttributeKey]) {
        approvedSeenTags[primaryAttributeKey] = {};
      }
      if (!instanceSeenTags[primaryAttributeKey]) {
        instanceSeenTags[primaryAttributeKey] = {};
      }
      if (!approvedSeenTags[primaryAttributeKey][value]) {
        instanceSeenTags[primaryAttributeKey][value] = true;
        return true;
      }
      return false;
    }).reverse().forEach((tag) => approvedTags.push(tag));
    const keys = Object.keys(instanceSeenTags);
    for (let i = 0; i < keys.length; i += 1) {
      const attributeKey = keys[i];
      const tagUnion = __spreadValues(__spreadValues({}, approvedSeenTags[attributeKey]), instanceSeenTags[attributeKey]);
      approvedSeenTags[attributeKey] = tagUnion;
    }
    return approvedTags;
  }, []).reverse();
};
var getAnyTrueFromPropsList = (propsList, checkedTag) => {
  if (Array.isArray(propsList) && propsList.length) {
    for (let index = 0; index < propsList.length; index += 1) {
      const prop = propsList[index];
      if (prop[checkedTag]) {
        return true;
      }
    }
  }
  return false;
};
var reducePropsToState = (propsList) => ({
  baseTag: getBaseTagFromPropsList([
    "href"
    /* HREF */
  ], propsList),
  bodyAttributes: getAttributesFromPropsList("bodyAttributes", propsList),
  defer: getInnermostProperty(propsList, HELMET_PROPS.DEFER),
  encode: getInnermostProperty(propsList, HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS),
  htmlAttributes: getAttributesFromPropsList("htmlAttributes", propsList),
  linkTags: getTagsFromPropsList(
    "link",
    [
      "rel",
      "href"
      /* HREF */
    ],
    propsList
  ),
  metaTags: getTagsFromPropsList(
    "meta",
    [
      "name",
      "charset",
      "http-equiv",
      "property",
      "itemprop"
      /* ITEM_PROP */
    ],
    propsList
  ),
  noscriptTags: getTagsFromPropsList("noscript", [
    "innerHTML"
    /* INNER_HTML */
  ], propsList),
  onChangeClientState: getOnChangeClientState(propsList),
  scriptTags: getTagsFromPropsList(
    "script",
    [
      "src",
      "innerHTML"
      /* INNER_HTML */
    ],
    propsList
  ),
  styleTags: getTagsFromPropsList("style", [
    "cssText"
    /* CSS_TEXT */
  ], propsList),
  title: getTitleFromPropsList(propsList),
  titleAttributes: getAttributesFromPropsList("titleAttributes", propsList),
  prioritizeSeoTags: getAnyTrueFromPropsList(propsList, HELMET_PROPS.PRIORITIZE_SEO_TAGS)
});
var flattenArray = (possibleArray) => Array.isArray(possibleArray) ? possibleArray.join("") : possibleArray;
var checkIfPropsMatch = (props, toMatch) => {
  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i += 1) {
    if (toMatch[keys[i]] && toMatch[keys[i]].includes(props[keys[i]])) {
      return true;
    }
  }
  return false;
};
var prioritizer = (elementsList, propsToMatch) => {
  if (Array.isArray(elementsList)) {
    return elementsList.reduce(
      (acc, elementAttrs) => {
        if (checkIfPropsMatch(elementAttrs, propsToMatch)) {
          acc.priority.push(elementAttrs);
        } else {
          acc.default.push(elementAttrs);
        }
        return acc;
      },
      { priority: [], default: [] }
    );
  }
  return { default: elementsList, priority: [] };
};
var without = (obj, key) => {
  return __spreadProps(__spreadValues({}, obj), {
    [key]: void 0
  });
};
var SELF_CLOSING_TAGS = [
  "noscript",
  "script",
  "style"
  /* STYLE */
];
var encodeSpecialCharacters = (str, encode = true) => {
  if (encode === false) {
    return String(str);
  }
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
};
var generateElementAttributesAsString = (attributes) => Object.keys(attributes).reduce((str, key) => {
  const attr = typeof attributes[key] !== "undefined" ? `${key}="${attributes[key]}"` : `${key}`;
  return str ? `${str} ${attr}` : attr;
}, "");
var generateTitleAsString = (type, title, attributes, encode) => {
  const attributeString = generateElementAttributesAsString(attributes);
  const flattenedTitle = flattenArray(title);
  return attributeString ? `<${type} ${HELMET_ATTRIBUTE}="true" ${attributeString}>${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>` : `<${type} ${HELMET_ATTRIBUTE}="true">${encodeSpecialCharacters(
    flattenedTitle,
    encode
  )}</${type}>`;
};
var generateTagsAsString = (type, tags, encode = true) => tags.reduce((str, t) => {
  const tag = t;
  const attributeHtml = Object.keys(tag).filter(
    (attribute) => !(attribute === "innerHTML" || attribute === "cssText")
  ).reduce((string, attribute) => {
    const attr = typeof tag[attribute] === "undefined" ? attribute : `${attribute}="${encodeSpecialCharacters(tag[attribute], encode)}"`;
    return string ? `${string} ${attr}` : attr;
  }, "");
  const tagContent = tag.innerHTML || tag.cssText || "";
  const isSelfClosing = SELF_CLOSING_TAGS.indexOf(type) === -1;
  return `${str}<${type} ${HELMET_ATTRIBUTE}="true" ${attributeHtml}${isSelfClosing ? `/>` : `>${tagContent}</${type}>`}`;
}, "");
var convertElementAttributesToReactProps = (attributes, initProps = {}) => Object.keys(attributes).reduce((obj, key) => {
  const mapped = REACT_TAG_MAP[key];
  obj[mapped || key] = attributes[key];
  return obj;
}, initProps);
var generateTitleAsReactComponent = (_type, title, attributes) => {
  const initProps = {
    key: title,
    [HELMET_ATTRIBUTE]: true
  };
  const props = convertElementAttributesToReactProps(attributes, initProps);
  return [React__default.createElement("title", props, title)];
};
var generateTagsAsReactComponent = (type, tags) => tags.map((tag, i) => {
  const mappedTag = {
    key: i,
    [HELMET_ATTRIBUTE]: true
  };
  Object.keys(tag).forEach((attribute) => {
    const mapped = REACT_TAG_MAP[attribute];
    const mappedAttribute = mapped || attribute;
    if (mappedAttribute === "innerHTML" || mappedAttribute === "cssText") {
      const content = tag.innerHTML || tag.cssText;
      mappedTag.dangerouslySetInnerHTML = { __html: content };
    } else {
      mappedTag[mappedAttribute] = tag[attribute];
    }
  });
  return React__default.createElement(type, mappedTag);
});
var getMethodsForTag = (type, tags, encode = true) => {
  switch (type) {
    case "title":
      return {
        toComponent: () => generateTitleAsReactComponent(type, tags.title, tags.titleAttributes),
        toString: () => generateTitleAsString(type, tags.title, tags.titleAttributes, encode)
      };
    case "bodyAttributes":
    case "htmlAttributes":
      return {
        toComponent: () => convertElementAttributesToReactProps(tags),
        toString: () => generateElementAttributesAsString(tags)
      };
    default:
      return {
        toComponent: () => generateTagsAsReactComponent(type, tags),
        toString: () => generateTagsAsString(type, tags, encode)
      };
  }
};
var getPriorityMethods = ({ metaTags, linkTags, scriptTags, encode }) => {
  const meta = prioritizer(metaTags, SEO_PRIORITY_TAGS.meta);
  const link = prioritizer(linkTags, SEO_PRIORITY_TAGS.link);
  const script = prioritizer(scriptTags, SEO_PRIORITY_TAGS.script);
  const priorityMethods = {
    toComponent: () => [
      ...generateTagsAsReactComponent("meta", meta.priority),
      ...generateTagsAsReactComponent("link", link.priority),
      ...generateTagsAsReactComponent("script", script.priority)
    ],
    toString: () => (
      // generate all the tags as strings and concatenate them
      `${getMethodsForTag("meta", meta.priority, encode)} ${getMethodsForTag(
        "link",
        link.priority,
        encode
      )} ${getMethodsForTag("script", script.priority, encode)}`
    )
  };
  return {
    priorityMethods,
    metaTags: meta.default,
    linkTags: link.default,
    scriptTags: script.default
  };
};
var mapStateOnServer = (props) => {
  const {
    baseTag,
    bodyAttributes,
    encode = true,
    htmlAttributes,
    noscriptTags,
    styleTags,
    title = "",
    titleAttributes,
    prioritizeSeoTags
  } = props;
  let { linkTags, metaTags, scriptTags } = props;
  let priorityMethods = {
    toComponent: () => {
    },
    toString: () => ""
  };
  if (prioritizeSeoTags) {
    ({ priorityMethods, linkTags, metaTags, scriptTags } = getPriorityMethods(props));
  }
  return {
    priority: priorityMethods,
    base: getMethodsForTag("base", baseTag, encode),
    bodyAttributes: getMethodsForTag("bodyAttributes", bodyAttributes, encode),
    htmlAttributes: getMethodsForTag("htmlAttributes", htmlAttributes, encode),
    link: getMethodsForTag("link", linkTags, encode),
    meta: getMethodsForTag("meta", metaTags, encode),
    noscript: getMethodsForTag("noscript", noscriptTags, encode),
    script: getMethodsForTag("script", scriptTags, encode),
    style: getMethodsForTag("style", styleTags, encode),
    title: getMethodsForTag("title", { title, titleAttributes }, encode)
  };
};
var server_default = mapStateOnServer;
var instances = [];
var isDocument = !!(typeof window !== "undefined" && window.document && window.document.createElement);
var HelmetData = class {
  constructor(context, canUseDOM) {
    __publicField(this, "instances", []);
    __publicField(this, "canUseDOM", isDocument);
    __publicField(this, "context");
    __publicField(this, "value", {
      setHelmet: (serverState) => {
        this.context.helmet = serverState;
      },
      helmetInstances: {
        get: () => this.canUseDOM ? instances : this.instances,
        add: (instance) => {
          (this.canUseDOM ? instances : this.instances).push(instance);
        },
        remove: (instance) => {
          const index = (this.canUseDOM ? instances : this.instances).indexOf(instance);
          (this.canUseDOM ? instances : this.instances).splice(index, 1);
        }
      }
    });
    this.context = context;
    this.canUseDOM = canUseDOM || false;
    if (!canUseDOM) {
      context.helmet = server_default({
        baseTag: [],
        bodyAttributes: {},
        encodeSpecialCharacters: true,
        htmlAttributes: {},
        linkTags: [],
        metaTags: [],
        noscriptTags: [],
        scriptTags: [],
        styleTags: [],
        title: "",
        titleAttributes: {}
      });
    }
  }
};
var defaultValue = {};
var Context = React__default.createContext(defaultValue);
var HelmetProvider = (_sa = class extends Component {
  constructor(props) {
    super(props);
    __publicField(this, "helmetData");
    this.helmetData = new HelmetData(this.props.context || {}, _sa.canUseDOM);
  }
  render() {
    return /* @__PURE__ */ React__default.createElement(Context.Provider, { value: this.helmetData.value }, this.props.children);
  }
}, __publicField(_sa, "canUseDOM", isDocument), _sa);
var updateTags = (type, tags) => {
  const headElement = document.head || document.querySelector(
    "head"
    /* HEAD */
  );
  const tagNodes = headElement.querySelectorAll(`${type}[${HELMET_ATTRIBUTE}]`);
  const oldTags = [].slice.call(tagNodes);
  const newTags = [];
  let indexToDelete;
  if (tags && tags.length) {
    tags.forEach((tag) => {
      const newElement = document.createElement(type);
      for (const attribute in tag) {
        if (Object.prototype.hasOwnProperty.call(tag, attribute)) {
          if (attribute === "innerHTML") {
            newElement.innerHTML = tag.innerHTML;
          } else if (attribute === "cssText") {
            if (newElement.styleSheet) {
              newElement.styleSheet.cssText = tag.cssText;
            } else {
              newElement.appendChild(document.createTextNode(tag.cssText));
            }
          } else {
            const attr = attribute;
            const value = typeof tag[attr] === "undefined" ? "" : tag[attr];
            newElement.setAttribute(attribute, value);
          }
        }
      }
      newElement.setAttribute(HELMET_ATTRIBUTE, "true");
      if (oldTags.some((existingTag, index) => {
        indexToDelete = index;
        return newElement.isEqualNode(existingTag);
      })) {
        oldTags.splice(indexToDelete, 1);
      } else {
        newTags.push(newElement);
      }
    });
  }
  oldTags.forEach((tag) => {
    var _a;
    return (_a = tag.parentNode) == null ? void 0 : _a.removeChild(tag);
  });
  newTags.forEach((tag) => headElement.appendChild(tag));
  return {
    oldTags,
    newTags
  };
};
var updateAttributes = (tagName, attributes) => {
  const elementTag = document.getElementsByTagName(tagName)[0];
  if (!elementTag) {
    return;
  }
  const helmetAttributeString = elementTag.getAttribute(HELMET_ATTRIBUTE);
  const helmetAttributes = helmetAttributeString ? helmetAttributeString.split(",") : [];
  const attributesToRemove = [...helmetAttributes];
  const attributeKeys = Object.keys(attributes);
  for (const attribute of attributeKeys) {
    const value = attributes[attribute] || "";
    if (elementTag.getAttribute(attribute) !== value) {
      elementTag.setAttribute(attribute, value);
    }
    if (helmetAttributes.indexOf(attribute) === -1) {
      helmetAttributes.push(attribute);
    }
    const indexToSave = attributesToRemove.indexOf(attribute);
    if (indexToSave !== -1) {
      attributesToRemove.splice(indexToSave, 1);
    }
  }
  for (let i = attributesToRemove.length - 1; i >= 0; i -= 1) {
    elementTag.removeAttribute(attributesToRemove[i]);
  }
  if (helmetAttributes.length === attributesToRemove.length) {
    elementTag.removeAttribute(HELMET_ATTRIBUTE);
  } else if (elementTag.getAttribute(HELMET_ATTRIBUTE) !== attributeKeys.join(",")) {
    elementTag.setAttribute(HELMET_ATTRIBUTE, attributeKeys.join(","));
  }
};
var updateTitle = (title, attributes) => {
  if (typeof title !== "undefined" && document.title !== title) {
    document.title = flattenArray(title);
  }
  updateAttributes("title", attributes);
};
var commitTagChanges = (newState, cb) => {
  const {
    baseTag,
    bodyAttributes,
    htmlAttributes,
    linkTags,
    metaTags,
    noscriptTags,
    onChangeClientState,
    scriptTags,
    styleTags,
    title,
    titleAttributes
  } = newState;
  updateAttributes("body", bodyAttributes);
  updateAttributes("html", htmlAttributes);
  updateTitle(title, titleAttributes);
  const tagUpdates = {
    baseTag: updateTags("base", baseTag),
    linkTags: updateTags("link", linkTags),
    metaTags: updateTags("meta", metaTags),
    noscriptTags: updateTags("noscript", noscriptTags),
    scriptTags: updateTags("script", scriptTags),
    styleTags: updateTags("style", styleTags)
  };
  const addedTags = {};
  const removedTags = {};
  Object.keys(tagUpdates).forEach((tagType) => {
    const { newTags, oldTags } = tagUpdates[tagType];
    if (newTags.length) {
      addedTags[tagType] = newTags;
    }
    if (oldTags.length) {
      removedTags[tagType] = tagUpdates[tagType].oldTags;
    }
  });
  if (cb) {
    cb();
  }
  onChangeClientState(newState, addedTags, removedTags);
};
var _helmetCallback = null;
var handleStateChangeOnClient = (newState) => {
  if (_helmetCallback) {
    cancelAnimationFrame(_helmetCallback);
  }
  if (newState.defer) {
    _helmetCallback = requestAnimationFrame(() => {
      commitTagChanges(newState, () => {
        _helmetCallback = null;
      });
    });
  } else {
    commitTagChanges(newState);
    _helmetCallback = null;
  }
};
var client_default = handleStateChangeOnClient;
var HelmetDispatcher = class extends Component {
  constructor() {
    super(...arguments);
    __publicField(this, "rendered", false);
  }
  shouldComponentUpdate(nextProps) {
    return !shallowEqual(nextProps, this.props);
  }
  componentDidUpdate() {
    this.emitChange();
  }
  componentWillUnmount() {
    const { helmetInstances } = this.props.context;
    helmetInstances.remove(this);
    this.emitChange();
  }
  emitChange() {
    const { helmetInstances, setHelmet } = this.props.context;
    let serverState = null;
    const state = reducePropsToState(
      helmetInstances.get().map((instance) => {
        const props = __spreadValues({}, instance.props);
        delete props.context;
        return props;
      })
    );
    if (HelmetProvider.canUseDOM) {
      client_default(state);
    } else if (server_default) {
      serverState = server_default(state);
    }
    setHelmet(serverState);
  }
  // componentWillMount will be deprecated
  // for SSR, initialize on first render
  // constructor is also unsafe in StrictMode
  init() {
    if (this.rendered) {
      return;
    }
    this.rendered = true;
    const { helmetInstances } = this.props.context;
    helmetInstances.add(this);
    this.emitChange();
  }
  render() {
    this.init();
    return null;
  }
};
var Helmet = (_ta = class extends Component {
  shouldComponentUpdate(nextProps) {
    return !fastCompare(without(this.props, "helmetData"), without(nextProps, "helmetData"));
  }
  mapNestedChildrenToProps(child, nestedChildren) {
    if (!nestedChildren) {
      return null;
    }
    switch (child.type) {
      case "script":
      case "noscript":
        return {
          innerHTML: nestedChildren
        };
      case "style":
        return {
          cssText: nestedChildren
        };
      default:
        throw new Error(
          `<${child.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`
        );
    }
  }
  flattenArrayTypeChildren(child, arrayTypeChildren, newChildProps, nestedChildren) {
    return __spreadProps(__spreadValues({}, arrayTypeChildren), {
      [child.type]: [
        ...arrayTypeChildren[child.type] || [],
        __spreadValues(__spreadValues({}, newChildProps), this.mapNestedChildrenToProps(child, nestedChildren))
      ]
    });
  }
  mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren) {
    switch (child.type) {
      case "title":
        return __spreadProps(__spreadValues({}, newProps), {
          [child.type]: nestedChildren,
          titleAttributes: __spreadValues({}, newChildProps)
        });
      case "body":
        return __spreadProps(__spreadValues({}, newProps), {
          bodyAttributes: __spreadValues({}, newChildProps)
        });
      case "html":
        return __spreadProps(__spreadValues({}, newProps), {
          htmlAttributes: __spreadValues({}, newChildProps)
        });
      default:
        return __spreadProps(__spreadValues({}, newProps), {
          [child.type]: __spreadValues({}, newChildProps)
        });
    }
  }
  mapArrayTypeChildrenToProps(arrayTypeChildren, newProps) {
    let newFlattenedProps = __spreadValues({}, newProps);
    Object.keys(arrayTypeChildren).forEach((arrayChildName) => {
      newFlattenedProps = __spreadProps(__spreadValues({}, newFlattenedProps), {
        [arrayChildName]: arrayTypeChildren[arrayChildName]
      });
    });
    return newFlattenedProps;
  }
  warnOnInvalidChildren(child, nestedChildren) {
    invariant(
      VALID_TAG_NAMES.some((name) => child.type === name),
      typeof child.type === "function" ? `You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.` : `Only elements types ${VALID_TAG_NAMES.join(
        ", "
      )} are allowed. Helmet does not support rendering <${child.type}> elements. Refer to our API for more information.`
    );
    invariant(
      !nestedChildren || typeof nestedChildren === "string" || Array.isArray(nestedChildren) && !nestedChildren.some((nestedChild) => typeof nestedChild !== "string"),
      `Helmet expects a string as a child of <${child.type}>. Did you forget to wrap your children in braces? ( <${child.type}>{\`\`}</${child.type}> ) Refer to our API for more information.`
    );
    return true;
  }
  mapChildrenToProps(children, newProps) {
    let arrayTypeChildren = {};
    React__default.Children.forEach(children, (child) => {
      if (!child || !child.props) {
        return;
      }
      const _a = child.props, { children: nestedChildren } = _a, childProps = __objRest(_a, ["children"]);
      const newChildProps = Object.keys(childProps).reduce((obj, key) => {
        obj[HTML_TAG_MAP[key] || key] = childProps[key];
        return obj;
      }, {});
      let { type } = child;
      if (typeof type === "symbol") {
        type = type.toString();
      } else {
        this.warnOnInvalidChildren(child, nestedChildren);
      }
      switch (type) {
        case "Symbol(react.fragment)":
          newProps = this.mapChildrenToProps(nestedChildren, newProps);
          break;
        case "link":
        case "meta":
        case "noscript":
        case "script":
        case "style":
          arrayTypeChildren = this.flattenArrayTypeChildren(
            child,
            arrayTypeChildren,
            newChildProps,
            nestedChildren
          );
          break;
        default:
          newProps = this.mapObjectTypeChildren(child, newProps, newChildProps, nestedChildren);
          break;
      }
    });
    return this.mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
  }
  render() {
    const _a = this.props, { children } = _a, props = __objRest(_a, ["children"]);
    let newProps = __spreadValues({}, props);
    let { helmetData } = props;
    if (children) {
      newProps = this.mapChildrenToProps(children, newProps);
    }
    if (helmetData && !(helmetData instanceof HelmetData)) {
      const data = helmetData;
      helmetData = new HelmetData(data.context, true);
      delete newProps.helmetData;
    }
    return helmetData ? /* @__PURE__ */ React__default.createElement(HelmetDispatcher, __spreadProps(__spreadValues({}, newProps), { context: helmetData.value })) : /* @__PURE__ */ React__default.createElement(Context.Consumer, null, (context) => /* @__PURE__ */ React__default.createElement(HelmetDispatcher, __spreadProps(__spreadValues({}, newProps), { context })));
  }
}, __publicField(_ta, "defaultProps", {
  defer: true,
  encodeSpecialCharacters: true,
  prioritizeSeoTags: false
}), _ta);
const SEOHead = ({
  title = "FairSplit - Fair Bill Splitting Calculator | Split Bills Based on Consumption",
  description = "Free bill splitting calculator that divides expenses fairly based on what each person consumed. Perfect for restaurants, group dinners, and shared expenses. No signup required.",
  keywords = "bill splitting calculator, fair split, expense sharing, bill splitter app, group expenses, restaurant bill calculator",
  canonical,
  ogImage = "https://fairsplit.app/og-image.png"
}) => {
  const location = useLocation();
  const currentUrl = `https://fairsplit.app${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;
  return /* @__PURE__ */ jsxs(Helmet, { children: [
    /* @__PURE__ */ jsx("title", { children: title }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: description }),
    /* @__PURE__ */ jsx("meta", { name: "keywords", content: keywords }),
    /* @__PURE__ */ jsx("link", { rel: "canonical", href: canonicalUrl }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: title }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: description }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: ogImage }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: currentUrl }),
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: title }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: description }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: ogImage })
  ] });
};
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuSubTrigger = React.forwardRef((_ua, ref) => {
  var _va = _ua, { className, inset, children } = _va, props = __objRest(_va, ["className", "inset", "children"]);
  return /* @__PURE__ */ jsxs(
    DropdownMenuPrimitive.SubTrigger,
    __spreadProps(__spreadValues({
      ref,
      className: cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent focus:bg-accent",
        inset && "pl-8",
        className
      )
    }, props), {
      children: [
        children,
        /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto h-4 w-4" })
      ]
    })
  );
});
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef((_wa, ref) => {
  var _xa = _wa, { className } = _xa, props = __objRest(_xa, ["className"]);
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.SubContent,
    __spreadValues({
      ref,
      className: cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )
    }, props)
  );
});
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef((_ya, ref) => {
  var _za = _ya, { className, sideOffset = 4 } = _za, props = __objRest(_za, ["className", "sideOffset"]);
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    __spreadValues({
      ref,
      sideOffset,
      className: cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )
    }, props)
  ) });
});
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef((_Aa, ref) => {
  var _Ba = _Aa, { className, inset } = _Ba, props = __objRest(_Ba, ["className", "inset"]);
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    __spreadValues({
      ref,
      className: cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
        inset && "pl-8",
        className
      )
    }, props)
  );
});
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef((_Ca, ref) => {
  var _Da = _Ca, { className, children, checked } = _Da, props = __objRest(_Da, ["className", "children", "checked"]);
  return /* @__PURE__ */ jsxs(
    DropdownMenuPrimitive.CheckboxItem,
    __spreadProps(__spreadValues({
      ref,
      className: cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
        className
      ),
      checked
    }, props), {
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
        children
      ]
    })
  );
});
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef((_Ea, ref) => {
  var _Fa = _Ea, { className, children } = _Fa, props = __objRest(_Fa, ["className", "children"]);
  return /* @__PURE__ */ jsxs(
    DropdownMenuPrimitive.RadioItem,
    __spreadProps(__spreadValues({
      ref,
      className: cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
        children
      ]
    })
  );
});
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef((_Ga, ref) => {
  var _Ha = _Ga, { className, inset } = _Ha, props = __objRest(_Ha, ["className", "inset"]);
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Label,
    __spreadValues({
      ref,
      className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)
    }, props)
  );
});
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef((_Ia, ref) => {
  var _Ja = _Ia, { className } = _Ja, props = __objRest(_Ja, ["className"]);
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, __spreadValues({ ref, className: cn("-mx-1 my-1 h-px bg-muted", className) }, props));
});
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
const migrateStorageData = () => {
  try {
    const data = localStorage.getItem("fairsplit-data");
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.version !== "2.0") {
        console.log("Migrating storage data to precision-safe format...");
        const migrated = __spreadProps(__spreadValues({}, sanitizeMonetaryData(parsed)), {
          version: "2.0",
          migratedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        localStorage.setItem("fairsplit-data", JSON.stringify(migrated));
        localStorage.setItem("fairsplit-data-backup", data);
        console.log("Storage data migration completed successfully");
      }
    }
  } catch (error) {
    console.error("Failed to migrate storage data:", error);
  }
};
if (typeof window !== "undefined") {
  migrateStorageData();
}
const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "PLN", symbol: "zł", name: "Polish Złoty" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" }
];
const Index = () => {
  const [participants, setParticipants] = useState([]);
  const [items, setItems] = useState([]);
  const [currency, setCurrency] = useState(CURRENCIES.find((c) => c.code === "INR") || CURRENCIES[0]);
  const { toast: toast2 } = useToast();
  useEffect(() => {
    cleanStorageData("fairsplit-data");
    const savedData = localStorage.getItem("fairsplit-data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const { participants: savedParticipants, items: savedItems, currency: savedCurrency } = sanitizeMonetaryData(parsed);
        setParticipants(savedParticipants || []);
        if (savedCurrency) {
          const foundCurrency = CURRENCIES.find((c) => c.code === savedCurrency.code);
          if (foundCurrency) {
            setCurrency(foundCurrency);
          }
        }
        const updatedItems = (savedItems || []).map((item) => {
          let sanitizedPrice = item.price;
          sanitizedPrice = Math.round((sanitizedPrice + Number.EPSILON) * 100) / 100;
          const nearestWhole = Math.round(sanitizedPrice);
          if (Math.abs(sanitizedPrice - nearestWhole) < 0.01) {
            sanitizedPrice = nearestWhole;
          }
          return __spreadProps(__spreadValues({}, item), {
            price: sanitizedPrice,
            participantsAtTime: item.participantsAtTime || savedParticipants || []
          });
        });
        setItems(updatedItems);
        if ((savedParticipants == null ? void 0 : savedParticipants.length) > 0 || (savedItems == null ? void 0 : savedItems.length) > 0) {
          toast2({
            title: "Data restored",
            description: "Your previous session has been restored and cleaned."
          });
        }
      } catch (error) {
        console.error("Failed to restore data:", error);
        localStorage.removeItem("fairsplit-data");
      }
    }
  }, [toast2]);
  useEffect(() => {
    if (participants.length > 0 || items.length > 0 || currency.code !== "INR") {
      const sanitizedItems = items.map((item) => __spreadProps(__spreadValues({}, item), {
        price: Math.round((item.price + Number.EPSILON) * 100) / 100
      }));
      localStorage.setItem("fairsplit-data", JSON.stringify({
        participants,
        items: sanitizedItems,
        currency
      }));
    }
  }, [participants, items, currency]);
  const formatCurrencyAmount = (amount) => {
    return formatCurrency(amount, currency);
  };
  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    toast2({
      title: "Currency changed",
      description: `Currency changed to ${newCurrency.name} (${newCurrency.symbol})`
    });
  };
  const handleAddParticipant = (name) => {
    if (participants.includes(name)) {
      toast2({
        title: "Duplicate participant",
        description: "This participant already exists.",
        variant: "destructive"
      });
      return;
    }
    setParticipants([...participants, name]);
    toast2({
      title: "Participant added",
      description: `${name} has been added to the bill.`
    });
  };
  const handleRemoveParticipant = (name) => {
    setParticipants(participants.filter((p) => p !== name));
    setItems(
      items.map((item) => __spreadProps(__spreadValues({}, item), {
        assignedTo: item.assignedTo.filter((p) => p !== name)
      }))
    );
    toast2({
      title: "Participant removed",
      description: `${name} has been removed from the bill.`
    });
  };
  const handleAddItem = (item) => {
    const sanitizedItem = __spreadProps(__spreadValues({}, item), {
      price: Math.round((item.price + Number.EPSILON) * 100) / 100,
      id: crypto.randomUUID()
    });
    setItems([...items, sanitizedItem]);
    toast2({
      title: "Item added",
      description: `${sanitizedItem.name} (${formatCurrencyAmount(sanitizedItem.price)}) has been added.`
    });
  };
  const handleRemoveItem = (id) => {
    const item = items.find((i) => i.id === id);
    setItems(items.filter((item2) => item2.id !== id));
    if (item) {
      toast2({
        title: "Item removed",
        description: `${item.name} has been removed.`
      });
    }
  };
  const handleEditItem = (id, updatedItem) => {
    setItems(items.map(
      (item) => item.id === id ? __spreadValues(__spreadValues({}, item), updatedItem) : item
    ));
    toast2({
      title: "Item updated",
      description: "Item participants have been updated."
    });
  };
  const handleClearAll = () => {
    setParticipants([]);
    setItems([]);
    localStorage.removeItem("fairsplit-data");
    toast2({
      title: "All data cleared",
      description: "Started fresh with a new bill."
    });
  };
  const handleExportData = (format) => {
    sumAmounts(items.map((item) => item.price));
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    if (format === "json") {
      const data = { participants, items, currency, timestamp: (/* @__PURE__ */ new Date()).toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      downloadFile(blob, `fairsplit-backup-${timestamp}.json`);
      toast2({
        title: "Backup exported",
        description: "Bill data backup downloaded as JSON file."
      });
    } else if (format === "summary") {
      const summaryContent = generateSummary();
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + summaryContent], { type: "text/plain;charset=utf-8" });
      downloadFile(blob, `fairsplit-summary-${timestamp}.txt`);
      toast2({
        title: "Summary exported",
        description: "Bill summary exported as text file."
      });
    }
  };
  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const generateSummary = () => {
    const billTotal = sumAmounts(items.map((item) => item.price));
    const date = (/* @__PURE__ */ new Date()).toLocaleDateString();
    const shares = {};
    participants.forEach((p) => {
      shares[p] = { consumed: 0, paid: 0, balance: 0 };
    });
    items.forEach((item) => {
      const assignedTo = item.assignedTo.length === 0 ? item.participantsAtTime : item.assignedTo;
      const dividedAmounts = divideAmount(item.price, assignedTo.length);
      assignedTo.forEach((participant, index) => {
        if (shares[participant]) {
          shares[participant].consumed += dividedAmounts[index] || 0;
        }
      });
      if (shares[item.paidBy]) {
        shares[item.paidBy].paid += item.price;
      }
    });
    Object.keys(shares).forEach((participant) => {
      shares[participant].balance = Math.round((shares[participant].paid - shares[participant].consumed + Number.EPSILON) * 100) / 100;
    });
    let summary = `FAIRSPLIT BILL SUMMARY
`;
    summary += `Date: ${date}
`;
    summary += `Currency: ${currency.name} (${currency.symbol})
`;
    summary += `Total Bill: ${formatCurrencyAmount(billTotal)}
`;
    summary += `Participants: ${participants.join(", ")}

`;
    summary += `ITEMS BREAKDOWN:
`;
    summary += `${"=".repeat(50)}
`;
    items.forEach((item) => {
      const assignedTo = item.assignedTo.length === 0 ? item.participantsAtTime : item.assignedTo;
      const dividedAmounts = divideAmount(item.price, assignedTo.length);
      const perPersonAmounts = dividedAmounts.map((amount) => formatCurrencyAmount(amount)).join(", ");
      summary += `${item.name}: ${formatCurrencyAmount(item.price)}
`;
      summary += `  Paid by: ${item.paidBy}
`;
      summary += `  Shared with: ${assignedTo.join(", ")}
`;
      summary += `  Per person: ${perPersonAmounts}

`;
    });
    summary += `SETTLEMENT SUMMARY:
`;
    summary += `${"=".repeat(50)}
`;
    Object.entries(shares).forEach(([name, share]) => {
      summary += `${name}:
`;
      summary += `  Consumed: ${formatCurrencyAmount(share.consumed)}
`;
      summary += `  Paid: ${formatCurrencyAmount(share.paid)}
`;
      summary += `  Balance: ${share.balance >= 0 ? "+" : "-"}${formatCurrencyAmount(Math.abs(share.balance))}

`;
    });
    const debtors = Object.entries(shares).filter(([_, s]) => s.balance < 0);
    const creditors = Object.entries(shares).filter(([_, s]) => s.balance > 0);
    if (debtors.length > 0) {
      summary += `PAYMENT INSTRUCTIONS:
`;
      summary += `${"=".repeat(50)}
`;
      debtors.forEach(([debtor, debtorShare]) => {
        creditors.forEach(([creditor, creditorShare]) => {
          if (creditorShare.balance > 0 && debtorShare.balance < 0) {
            const payment = Math.min(Math.abs(debtorShare.balance), creditorShare.balance);
            if (payment > 0.01) {
              summary += `${debtor} pays ${creditor}: ${formatCurrencyAmount(payment)}
`;
              debtorShare.balance += payment;
              creditorShare.balance -= payment;
            }
          }
        });
      });
    } else {
      summary += `All settled! No payments needed.
`;
    }
    summary += `
Generated by FairSplit - Fair bill splitting made easy`;
    return summary;
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(SEOHead, {}),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-neutral-50/50 selection:bg-primary/10 selection:text-primary", children: [
      /* @__PURE__ */ jsx("header", { className: "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/40", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-sm tracking-tighter", children: "FS" }) }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { className: "text-sm font-bold tracking-tight text-primary", children: "FairSplit" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "h-8 gap-2 font-medium text-muted-foreground hover:text-primary", children: [
              /* @__PURE__ */ jsx("span", { className: "font-mono text-xs", children: currency.symbol }),
              /* @__PURE__ */ jsx("span", { className: "text-xs", children: currency.code }),
              /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3 opacity-50" })
            ] }) }),
            /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", className: "w-56 max-h-[300px]", children: CURRENCIES.map((curr) => /* @__PURE__ */ jsxs(
              DropdownMenuItem,
              {
                onClick: () => handleCurrencyChange(curr),
                className: "justify-between",
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-mono text-muted-foreground w-4 text-center", children: curr.symbol }),
                    /* @__PURE__ */ jsx("span", { children: curr.code })
                  ] }),
                  currency.code === curr.code && /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-primary" })
                ]
              },
              curr.code
            )) })
          ] }),
          (participants.length > 0 || items.length > 0) && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "h-8 gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: "Export" }),
                /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3 opacity-50" })
              ] }) }),
              /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
                /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => handleExportData("summary"), children: [
                  /* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5 mr-2 text-muted-foreground" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Summary (TXT)" })
                ] }),
                /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => handleExportData("json"), children: [
                  /* @__PURE__ */ jsx(Archive, { className: "h-3.5 w-3.5 mr-2 text-muted-foreground" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Backup (JSON)" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Button, { onClick: handleClearAll, variant: "ghost", size: "sm", className: "h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5", children: /* @__PURE__ */ jsx("span", { className: "text-xs", children: "Clear" }) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("main", { className: "max-w-5xl mx-auto px-4 md:px-6 pt-24 pb-12 w-full", children: [
        participants.length === 0 && items.length === 0 && /* @__PURE__ */ jsxs("div", { className: "max-w-lg mx-auto text-center py-20 animate-fade-in", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-4xl md:text-5xl font-bold tracking-tighter text-primary mb-6", children: [
            "Split bills, ",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "fair and square." })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground mb-10 leading-relaxed max-w-sm mx-auto", children: "The precision bill splitter for groups who value fairness over simplicity." }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-4", children: /* @__PURE__ */ jsx(
            Button,
            {
              size: "lg",
              className: "h-12 px-8 rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300",
              onClick: () => {
                const participantInput = document.querySelector('input[placeholder*="Enter name"]');
                participantInput == null ? void 0 : participantInput.focus();
              },
              children: "Start splitting"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 space-y-6 lg:sticky lg:top-24", children: [
            /* @__PURE__ */ jsx(
              BillHeader,
              {
                participants,
                onAddParticipant: handleAddParticipant,
                onRemoveParticipant: handleRemoveParticipant
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "border border-border/50 rounded-xl bg-white shadow-sm overflow-hidden", children: /* @__PURE__ */ jsx(AddItemForm, { participants, onAddItem: handleAddItem, currency }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8 space-y-6", children: [
            items.length > 0 && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border/50 bg-white shadow-sm overflow-hidden min-h-[200px]", children: /* @__PURE__ */ jsx(
              ItemList,
              {
                items,
                participants,
                onRemoveItem: handleRemoveItem,
                onEditItem: handleEditItem,
                currency,
                formatCurrency: formatCurrencyAmount
              }
            ) }),
            /* @__PURE__ */ jsx("section", { "aria-label": "Settlement Summary", children: /* @__PURE__ */ jsx(
              SettlementSummary,
              {
                items,
                participants,
                currency,
                formatCurrency: formatCurrencyAmount
              }
            ) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("footer", { className: "border-t border-border/40 bg-white/50 py-12", children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-4 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "FairSplit © ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " · Crafted with precision."
      ] }) }) })
    ] })
  ] });
};
const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "mb-4 text-4xl font-bold", children: "404" }),
    /* @__PURE__ */ jsx("p", { className: "mb-4 text-xl text-gray-600", children: "Oops! Page not found" }),
    /* @__PURE__ */ jsx("a", { href: "/", className: "text-blue-500 underline hover:text-blue-700", children: "Return to Home" })
  ] }) });
};
const queryClient = new QueryClient();
function App({ children }) {
  return /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsx(ClientOnly, { children: /* @__PURE__ */ jsxs(TooltipProvider, { children: [
      /* @__PURE__ */ jsx(Toaster$1, {}),
      /* @__PURE__ */ jsx(Toaster, {})
    ] }) }),
    /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Loading..." }), children })
  ] }) });
}
const routes = [
  {
    path: "/",
    element: /* @__PURE__ */ jsx(App, { children: /* @__PURE__ */ jsx(Index, {}) })
  },
  {
    path: "*",
    element: /* @__PURE__ */ jsx(App, { children: /* @__PURE__ */ jsx(NotFound, {}) })
  }
];
const preloadCriticalResources = () => {
  if (typeof window === "undefined") return;
  const fontLink = document.createElement("link");
  fontLink.rel = "preload";
  fontLink.as = "font";
  fontLink.type = "font/woff2";
  fontLink.crossOrigin = "anonymous";
  fontLink.href = "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2";
  document.head.appendChild(fontLink);
};
if (typeof window !== "undefined") {
  preloadCriticalResources();
}
const createApp = ViteReactSSG(
  { routes, basename: "/" },
  ({ app, router, routes: routes2, isClient, initialState }) => {
    if (isClient && false) {
      window.addEventListener("load", () => {
        setTimeout(() => {
        }, 0);
      });
    }
  }
);
if ("serviceWorker" in navigator && true) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then((registration) => {
      console.log("✅ Service Worker registered:", registration.scope);
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              if (confirm("New version available! Reload to update?")) {
                window.location.reload();
              }
            }
          });
        }
      });
    }).catch((error) => {
      console.error("❌ Service Worker registration failed:", error);
    });
  });
}
export {
  createApp
};
