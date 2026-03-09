<script lang="ts">
    import OnDemandRender from "OnDemandRender.svelte";

    import type { TagFolderSettings, ViewItem } from "types";
    import { currentFile, pluginInstance, tagFolderSetting, selectedItems, lastSelectedPath } from "./store";
    import { get } from "svelte/store";

    interface Props {
        // Display props
        item: ViewItem;
        trail: string[];
        fileIcon?: string;
        // Callbacks
        openFile: (path: string, specialKey: boolean) => void;
        showMenu: (
        evt: MouseEvent,
        trail: string[],
        targetTag?: string,
        targetItems?: ViewItem[],
    ) => void;
        hoverPreview: (e: MouseEvent, path: string) => void;
    }

    let {
        item,
        trail,
        fileIcon = "",
        openFile,
        showMenu,
        hoverPreview
    }: Props = $props();

    // Event handlers
    function handleMouseover(e: MouseEvent, path: string) {
        hoverPreview(e, path);
    }

    const _setting = $derived($tagFolderSetting as TagFolderSettings);
    const _currentActiveFilePath = $derived($currentFile);

    // To highlighting
    let isActive = $derived(item.path === _currentActiveFilePath);
    let isSelected = $derived($selectedItems.has(item.path));

    let isItemVisible = $state(false);

    const draggable = $derived(!_setting.disableDragging);
    const app = $derived($pluginInstance?.app);
    //@ts-ignore internal API
    const dm = $derived(app?.dragManager);

    function dragStartFile(args: DragEvent) {
        if (!draggable) return;
        const file = app.vault.getAbstractFileByPath(item.path);
        const param = dm.dragFile(args, file);
        if (param) {
            return dm.onDragStart(args, param);
        }
    }
</script>

<OnDemandRender cssClass="tree-item nav-file" bind:isVisible={isItemVisible}>
    {#snippet children({ isVisible })}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="tree-item-self is-clickable nav-file-title"
            class:is-active={isActive}
            class:is-selected={isSelected}
            {draggable}
            data-path={item.path}
            ondragstart={dragStartFile}
            onclick={(evt) => {
                if (evt.shiftKey) {
                    evt.preventDefault();
                    const anchor = get(lastSelectedPath);
                    const allEls = Array.from(
                        document.querySelectorAll<HTMLElement>(
                            '[data-type="tag-explorer-view"] .nav-file-title[data-path]'
                        )
                    );
                    const anchorIdx = allEls.findIndex(el => el.dataset.path === anchor);
                    const targetIdx = allEls.findIndex(el => el.dataset.path === item.path);
                    const [start, end] = anchorIdx <= targetIdx
                        ? [anchorIdx, targetIdx]
                        : [targetIdx, anchorIdx];
                    const rangePaths = allEls
                        .slice(start < 0 ? targetIdx : start, end + 1)
                        .map(el => el.dataset.path!);
                    selectedItems.update((s) => {
                        const next = new Set(s);
                        rangePaths.forEach(p => next.add(p));
                        return next;
                    });
                } else if (evt.metaKey || evt.ctrlKey) {
                    evt.preventDefault();
                    lastSelectedPath.set(item.path);
                    selectedItems.update((s) => {
                        const next = new Set(s);
                        if (next.has(item.path)) next.delete(item.path);
                        else next.add(item.path);
                        return next;
                    });
                } else {
                    lastSelectedPath.set(item.path);
                    selectedItems.set(new Set());
                    openFile(item.path, false);
                }
            }}
            onmouseover={(e) => {
                handleMouseover(e, item.path);
            }}
            onfocus={() => {
                /* ignore aria complaint */
            }}
            oncontextmenu={(evt) => showMenu(evt, trail, undefined, [item])}
        >
            {#if isVisible && fileIcon}
                <div class="tree-item-icon nav-file-icon">{@html fileIcon}</div>
            {/if}
            <div class="tree-item-inner nav-file-title-content lsl-f">
                {isVisible ? item.displayName : ""}
            </div>
        </div>
    {/snippet}
</OnDemandRender>
