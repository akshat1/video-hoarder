# Modeling rules to match presets with videos

|        |                                                                           |
|--------|---------------------------------------------------------------------------|
| Title  | Preset match rule modeling                                                |
| Tags   | preset, preset matching                                                   |
| Status | Proposed                                                                  |
| Date   | 15th April, 2023                                                          |


## Problem

Currently, presets and matching rules live as a single entity in config.yml. This presents a number of disadvantages
1. A user can't create / modify a preset, or matchign rule without modifying the config file.
1. Rules are not namespaced to individual users.
1. Match syntax is confusing (I end up using just the titrle match).

## Proposed solution

We will
1. Model presets and match rules as two separate entities.
1. These will be stored in the database.
1. These will be private to the user by default, with the option to share with the entire set-up.
1. These will be editable from the UI.

### Preset

| Preset                     |
|----------------------------|
| +id: String                |
| +name: String              |
| +downloadLocation: String  |
| +formatSelector: String    |
| +rateLimit: String         |
| +private: Boolean          |
| +createdAt: ISODate        |
| +createdBy: String         |
| +updatedAt: ISODate        |
| +updatedBy: String         |

### Match Rule

The match rule models a condition which if true, will cause the preset (identified using the presetId) to be applied to the vide on question.

The condition itself is user supplied JavaScript, and is expected to be the body of a function which will get a video metadata object, and is expected to return something which will be interpreted as truthy or otherwise.

This script will be executed inside a sandbox provided by the vm2 library.

The editing UI will make it clear to the user that they are writing the body of the function described above. Because the signature is fixed, we don't want to let the user modify the function signature; only the body.

| PresetMatchRule            |
|----------------------------|
| +id: String                |
| +ruleJS: String     // Execute in vm2; Should return a boolean |
| +presetId: String          |
| +createdAt: ISODate        |
| +createdBy: String         |
| +updatedAt: ISODate        |
| +updatedBy: String         |

