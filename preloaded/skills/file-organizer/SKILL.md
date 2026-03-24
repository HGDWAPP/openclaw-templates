# File Organizer

Organize messy files and folders into a clean, logical structure.

## Trigger
When the user says "organize [folder]" / "clean up [path]" / "sort my files" / "this folder is a mess"

## Flow

### Step 1: Scan
1. List all files in the target directory
2. Count files by type (documents, images, code, data, misc)
3. Check for duplicates (same name or very similar names)
4. Report what you found:

```
FOLDER SCAN: [path]

Found [N] files:
- [X] documents (.md, .txt, .pdf, .docx)
- [X] images (.png, .jpg, .svg)
- [X] data (.csv, .json, .xlsx)
- [X] other

[X] possible duplicates detected

Want me to organize these? I'll show you the plan before moving anything.
```

### Step 2: Propose Structure
Show the user what you plan to do BEFORE doing it:

```
PROPOSED STRUCTURE:
[folder]/
  documents/    — [list of files going here]
  images/       — [list of files going here]
  data/         — [list of files going here]
  archive/      — [duplicates and old files]

Move [N] files total. Nothing gets deleted.

Look good? (yes / adjust / cancel)
```

### Step 3: Execute
Only after user confirms:
1. Create the subdirectories
2. Move files into the appropriate folders
3. Move duplicates to archive/ (never delete)
4. Report what was done

### Step 4: Confirm
```
Done! Organized [N] files into [X] folders.
[Duplicates] files moved to archive/ for review.
Nothing was deleted.
```

## Rules
- NEVER delete files — only move them
- ALWAYS show the plan before executing
- ALWAYS ask for confirmation before moving files
- If a folder has fewer than 5 files, suggest it might not need organizing
- Preserve original filenames — don't rename unless asked
- Log the organization to today's daily note
