# AI Instructions: Widget Maintenance Protocol

You are in charge of maintaining the "Embeddable Widget" architecture of this project. Follow these rules after EVERY modification:

## 1. Documentation Sync
Whenever you modify the core mounting logic, build configuration, or styling isolation:
- Update `WIDGET_MIGRATION_GUIDE.md` with the new technical details.
- Ensure the "Last updated" date in the guide is current.

## 2. Parameter Integrity
When adding new customization parameters (for colors, fonts, layout, etc.):
- Document the new `data-` attributes in the "External Customization" section of the guide.
- Provide a clear example of how a web developer should use the attribute.

## 3. Deployment Safety
Remind the user to run the build and deploy command (`npm run build && cd dist && npx vercel --prod`) after any change that affects the `widget.iife.js` output.

## 4. Continuity
If the project is migrated or used as a template, use these instructions to ensure the "generic" version retains all the robust mounting and isolation features implemented in this branch.
