# Name Guard

A proof-of-concept that mimics World of Warcraft's character name picker and checks whether a chosen name passes a content-moderation guard powered by an AI decision model (Jev).

## Language

**Name**:
The full character name a player picks, consisting of a Main Name and a Secondary Name, as introduced by World of Warcraft: Forever. The UI mirrors WoW's "Full Name" picker (two fields, one dice button).
_Avoid_: character name, username

**Main Name**:
The left name field. Max length matches the Secondary Name.
_Avoid_: first name, given name

**Secondary Name**:
The right name field. Max length matches the Main Name.
_Avoid_: surname, last name

**Full Name**:
The Main Name and Secondary Name joined with a space (e.g. "Pe Nis"). This is what the Name Guard judges — never the parts in isolation, because banned content can span both parts.

**Joined Name**:
The Main Name and Secondary Name concatenated into a single lowercase word with separators removed (e.g. "penis"). Because banned words often only surface when the parts are joined, the Name Guard judges the Full Name *and* the Joined Name together.

**Name Guard**:
The content check itself. It judges *content only* (sexual, racist, other offensive material) of the Full Name — it deliberately does NOT enforce WoW's formatting rules (capitalization, allowed characters, min length). Only a shared max length applies. One guard covers the whole name; its Verdict applies to both fields.
_Avoid_: name validator, name checker, field check

**Verdict**:
The outcome of the Name Guard for a name: Clean, Suspicious, or Flagged. Based on Jev's probabilities crossing thresholds, not on free-form text.

**Detail Panel**:
A WoW-themed collapsible area showing the raw Jev answers (per-category probabilities, category, severity) behind a Verdict.

**Rejection Message**:
What the user sees on a failed name: deliberately vague and WoW-flavoured ("You cannot use that name"). The specific reason is only revealed in the Detail Panel.
