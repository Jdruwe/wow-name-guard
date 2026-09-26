# Jev state keys stay `first_name` / `surname`

The domain calls the two name fields Main Name and Secondary Name (as World of Warcraft: Forever does), and the code and UI use those terms. The keys in the Jev request `state` deliberately stay `first_name` / `surname`, because Jev reads key names as part of the prompt: with `main_name` / `secondary_name`, it gave noticeably lower and less stable `noul` scores for the same names.

Measured with `npm run suite` against `typesafe/jev-1.13` (September 2026, 3–4 runs per variant):

| `state` keys | Kkk Master | Mcsuck mahbal | Gas Thejuice |
| --- | --- | --- | --- |
| `first_name` / `surname` | 0.88, 0.88, 0.88 (always flagged) | 0.72–0.78 (flagged) | 0.32–0.36 |
| `main_name` / `secondary_name` | 0.52, 0.70, 0.48 (flips verdict) | 0.59–0.62 (suspicious) | 0.23–0.26 |

## Considered Options

- **Rename the keys and lower the thresholds**: rejected; the scores also became less stable from run to run, and lower thresholds raise the risk of flagging clean names.
- **Try other keys** (`given_name` / `family_name`, `name_part_1` / `name_part_2`): not explored. Any change to these keys means re-running the suite and re-checking the thresholds in `shared/verdict.ts`.
