// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useRef } from "react";
import {
  Group,
  Panel,
  Separator,
  useDefaultLayout,
  type PanelImperativeHandle,
  type PanelSize,
} from "react-resizable-panels";
import { AIPanel } from "@/components/ai/AIPanel";
import { BinderPanel } from "@/components/binder/BinderPanel";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { StatusBar } from "@/components/layout/StatusBar";
import { TopBar } from "@/components/layout/TopBar";
import { useUiStore } from "@/store/uiStore";

/** Keeps a collapsible panel in sync with a boolean in the UI store (both directions). */
function useCollapsibleSync(open: boolean, setOpen: (open: boolean) => void) {
  const ref = useRef<PanelImperativeHandle | null>(null);

  useEffect(() => {
    const panel = ref.current;
    if (!panel) return;
    if (open && panel.isCollapsed()) panel.expand();
    if (!open && !panel.isCollapsed()) panel.collapse();
  }, [open]);

  const onResize = (size: PanelSize) => {
    const isOpen = size.inPixels > 0;
    if (isOpen !== open) setOpen(isOpen);
  };

  return { ref, onResize };
}

const separatorClass =
  "w-px bg-line transition-colors duration-100 data-[separator=hover]:bg-accent data-[separator=active]:bg-accent";

/** Main window: binder · editor · AI, top bar and status bar (PROJECT_BIBLE.md §5.2). */
export function AppShell() {
  const { binderOpen, aiOpen, setBinderOpen, setAiOpen, focusMode } = useUiStore();
  const binder = useCollapsibleSync(binderOpen, setBinderOpen);
  const ai = useCollapsibleSync(aiOpen, setAiOpen);

  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: "main-layout",
    storage: localStorage,
    onlySaveAfterUserInteractions: true,
  });

  return (
    <div className="flex h-full flex-col">
      {!focusMode && <TopBar />}

      <Group
        id="main-layout"
        orientation="horizontal"
        defaultLayout={defaultLayout}
        onLayoutChanged={onLayoutChanged}
        className="min-h-0 flex-1"
      >
        <Panel
          id="binder"
          panelRef={binder.ref}
          onResize={binder.onResize}
          collapsible
          collapsedSize={0}
          defaultSize={260}
          minSize={200}
          maxSize={420}
        >
          <BinderPanel />
        </Panel>
        <Separator className={separatorClass} disabled={!binderOpen} />

        <Panel id="editor" minSize={420}>
          <EditorPanel />
        </Panel>

        <Separator className={separatorClass} disabled={!aiOpen} />
        <Panel
          id="ai"
          panelRef={ai.ref}
          onResize={ai.onResize}
          collapsible
          collapsedSize={0}
          defaultSize={320}
          minSize={260}
          maxSize={520}
        >
          <AIPanel />
        </Panel>
      </Group>

      <StatusBar />
    </div>
  );
}
