# renders/

Scratch output from the Higgsfield CLI. **Not the source of truth.**

The installed covers under `app/public/img/covers/` are, and they are what the
site serves. The PNGs here are intermediate and get overwritten by whichever
generation script ran last.

That bit us once: a superseded generation script was still running in the
background and overwrote two PNGs *after* the good versions had already been
converted and installed. The JPEGs were fine — the PNGs beside them were not,
so re-installing from this folder would have silently reverted two covers to a
composition that had already been rejected. `intermodal.png` and `storage.png`
were deleted for exactly that reason; their installed JPEGs are correct.

**Before running a generation script, stop any earlier one still running.**
Two scripts writing the same filenames is a race, and the loser is whichever
you looked at first.

| Script | What it renders |
|---|---|
| `covers4.sh` | the four service page covers — current recipe |
| `careers.sh` | the five careers card photographs |
| `cards.sh` | the 16 section-02 service card images (not yet run on the current recipe) |
| `covers.sh`, `covers2.sh`, `covers3.sh` | superseded passes, kept for the prompt history |
