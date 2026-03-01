## Tag Folder Plus

> **This is a fork of [TagFolder](https://github.com/vrtmrz/obsidian-tagfolder) by vorotamoroz.**

Use nested tags as a replacement for Obsidian's file explorer. Each tag namespace (`area/`, `source/`, `status/`, …) is an independent folder hierarchy. A note tagged `#area/coding` and `#source/book` appears under _both_ `area/coding` and `source/book` simultaneously — the same file in two places at once, just like a symlink.

### Changes from upstream

- **`ignoreTags` now matches prefixes** — setting `source` in the ignore list hides `source/book`, `source/ai`, and all other `source/*` tags, not just the bare `source` tag.
- **`mergeRedundantCombination` is namespace-aware** — notes tagged with both `area/coding` and `source/book` now correctly appear under both namespaces. Previously, the deduplication logic would hide the note from whichever namespace was processed second.
- **No cross-namespace children** — inside `source/book`, only deeper `source/*` sub-tags appear as sub-folders. Tags from other namespaces (e.g. `area/*`) no longer bleed in as nested children.

### How to use

Install this plugin, press `Ctrl+p`, and choose "Show Tag Folder Plus".

### How it works

Each top-level tag namespace becomes an independent folder tree. A note tagged with multiple namespaces appears in **all of them simultaneously**.

```
Meeting notes : #area/work    #status/active
Research doc  : #area/coding  #source/book   #status/active
Book summary  : #source/book  #status/done
```

The tree looks like:

```
area/
  coding/
    Research doc
  work/
    Meeting notes
source/
  book/
    Research doc
    Book summary
status/
  active/
    Meeting notes
    Research doc
  done/
    Book summary
```

#### Search

Filter the tree by typing in the search box. Filters are matched against tags.

| Syntax | Meaning |
|--------|---------|
| `source` | tag contains "source" (substring) |
| `#source` | tag starts with "source" (namespace-aware) |
| `-source` | exclude tags containing "source" |
| `-#area` | exclude entire `area/*` namespace |
| `A B` | AND — tag must match both A and B |
| `A \| B` | OR — show notes matching A or notes matching B |

### Settings

#### Behavior

##### Always Open

Place Tag Folder Plus on the left pane and activate it at every Obsidian launch.

#### Files

##### Display Method

Configure how file entries are displayed.

##### Order method

Order items by displaying name, filename, modified time, or full path.

##### Use title

Show the note's title from frontmatter or the first H1 heading instead of the filename.

##### Frontmatter path

Dotted path to retrieve the title from frontmatter.

#### Tags

##### Order method

Order tags by name or count of items.

##### Namespace-scoped sub-folders

When inside a tag folder, only show sub-folders from the same root namespace. For example, inside `source/`, folders from `area/` or `project/` will not appear. Can also be toggled from the toolbar filter button.

#### Actions

##### Search tags inside TagFolder when clicking tags

Search inside Tag Folder Plus when clicking a tag, instead of opening Obsidian's default search. Ctrl/Shift-click adds or removes exclusions.

##### List files in a separated pane

When enabled, files are shown in a separate pane.

#### Arrangements

##### Hide Items

Configure when files are hidden from intermediate folders:

- **Hide nothing** — files appear at every level.
- **Only intermediates of nested tags** — files are hidden inside nested tag levels.
- **All intermediates** — files only appear at the deepest level.

##### Merge redundant combinations

When enabled, `a/b` and `b/a` are merged into a single folder if there are no intermediates.

##### Do not simplify empty folders

Keep empty folders rather than collapsing them.

##### Reduce duplicated parents in nested tags

When a note has multiple nested tags sharing a parent (e.g. `#topic/calculus` and `#topic/electromagnetics`), collapse the repeated parent so `topic` appears only once.

#### Filters

##### Target Folders

Only index files in the specified folders.

##### Ignore Folders

Exclude documents in specific folders.

##### Ignore note tag

If a note has any of these tags, it is excluded entirely.

##### Ignore tag

Tags listed here are invisible — treated as if they don't exist.

##### Archive tags

Tags treated as archive namespaces; their contents are hidden from the main tree unless you navigate into the archive folder directly.
