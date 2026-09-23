# SRC-GOOGLE-ANDROID-QUALITY — Android app quality guidelines (core app quality and adaptive app quality)

- Authority: Google (Android Developers, "App quality" section of developer.android.com)
- Canonical URL: https://developer.android.com/docs/quality-guidelines/core-app-quality (core) and https://developer.android.com/docs/quality-guidelines/adaptive-app-quality (adaptive; tier pages under `/adaptive-app-quality/tier-3`, `/tier-2`, `/tier-1`, and `/adaptive-app-quality/experiences/{desktop,foldables,camera-audio,stylus}`). The old URL https://developer.android.com/docs/quality-guidelines/large-screen-app-quality redirects to the adaptive overview.
- Version / date: living documentation, no version numbers; dated archive snapshots stand in for versions. Footer dates read 2026-09-23: core app quality "Last updated 2026-09-21"; adaptive overview 2026-04-10; Tier 3 2026-08-18; Tier 2 2026-08-18; Tier 1 2026-04-10; Desktop, Foldables, Camera and Audio, and Stylus experience pages 2026-08-18
- Source status: CURRENT
- Superseded by / supersedes: the adaptive app quality guidelines say they replace and extend the large screen app quality guidelines. That version, dated 2026-01-21, is archived at `/docs/quality-guidelines/archive/adaptive/large-screen-app-quality` (archive page footer 2026-02-26) and is SUPERSEDED. An old-to-new ID map is at `/docs/quality-guidelines/archive/adaptive/id-map-ls-adaptive` (footer 2026-03-23). A Tier 2 snapshot dated 2026-04-07 is also archived. The core guidelines have archived versions dated 2026-03-20, 2021-05-17, and 2021-02-10 under `/docs/quality-guidelines/archive/core/`.
- License / access: open, no login. Every page footer says content and code samples fall under the site Content License (https://developer.android.com/license). That page, read 2026-09-23, says documentation on the site, including any code shown in it, is under Apache 2.0 unless otherwise noted. It says all other content, apart from the license documents and anything otherwise noted, is under Creative Commons Attribution 2.5. Trademarks, including the Android logo, are excluded. The page does not say which of the two licenses covers guideline prose like these checklists. Either way, paraphrase with attribution is allowed. See Uncertainties: this reading differs from the SRC-GOOGLE-ANDROID-A11Y registry row.
- Verified on: 2026-09-23. All pages above were fetched at developer.android.com; footer dates, redirect, supersession notice, archive lists, ID map, and license page were read.
- Tier: T2
- Domains served (proposed; the lead decides): PLAT-FORM-FACTORS, VIS-ADAPTIVE, VIS-ORIENTATION. Optional additions: PLAT-ANDROID-A11Y, UX-NAVIGATION, OTH-PERF-UX, VIS-TYPOGRAPHY. Not VIS-SAFE-AREAS: these guideline pages do not cover insets, cutouts, or edge-to-edge (see Cross-references).

## Scope and applicability

- Platform: Android apps (phones, foldables, tablets, ChromeOS and desktop windowing, external keyboard, mouse, trackpad, and stylus). The App quality section also holds separate guidelines for Wear OS, TV, Car, Android XR, and widgets. They are not part of this source (listed under Cross-references as candidates).
- Jurisdiction: GLOBAL. There is no conformance or certification model; these are self-assessment checklists with test procedures.
- Core app quality: the introduction calls these the minimum quality that all apps should meet. The source's force word is "should". Items are written as declarative pass criteria, each linked to one or more test procedures.
- Adaptive app quality: three cumulative tiers. Tier 3 "Adaptive ready" is basic: full screen or full window, no letterboxing or compatibility mode, critical task flows work, and basic external-input support. Tier 2 "Adaptive optimized" adds layout optimization for all screen sizes and device configurations plus enhanced input support. Tier 1 "Adaptive differentiated" is a device-tailored experience (multitasking, foldable postures, drag and drop, stylus). The overview frames Tier 2 as the requirements for an excellent experience on all Android devices and Tier 1 as what makes an app outstanding on foldables and large screens.
- Built as test checklists, so the items map directly to PLATFORM audit rules and many carry explicit thresholds.

## Structure

### Core app quality (2026-09-21)

- Identifier scheme: name-style guideline IDs (for example `Touch_Target_Size`) and matching test IDs with a `T-` prefix (for example `T-Touch_Target_Size`). One test can serve several guidelines (for example `T-Orientation_Transitions` serves Display_State_Parity, Fullscreen_Display, and Orientation_Transitions). Each guideline table has the columns ID, Tests, and Description.
- ID history: the scheme has changed at least twice. The 2021-05-17 archive uses code IDs (`VX-N1`, `VX-S1`, `VX-U1`, `VX-A1` ...). The 2026-03-20 archive uses `Area:Short` IDs (`Usability:Switcher`, `UI:Fullscreen`, `Access:Targets`, `Nav:BackGesture` ...). The current page uses name-style IDs. No published ID map was found for the core guidelines. The adaptive guidelines do have one.
- Areas and guideline IDs as read. Paraphrases are in Candidate rules.
  - User experience: usability (Consistent_UX, App_Switcher, Sleep_Resume, Lock_Resume); user interface (Display_State_Parity, Fullscreen_Display, Orientation_Transitions); visual quality (Graphic_Quality, Line_Length, Theme_Support); navigation (Back_Button_Nav, Back_Gesture_Nav, State_Preservation); notifications (Notification_Quality, Conversation_Quality); accessibility (Touch_Target_Size, Visual_Contrast, Content_Description).
  - Functionality: audio (Audio_Playback_Start, Audio_Focus_Request, Audio_Focus_Change, Audio_Playback_Background, Audio_Notification_Style, Audio_Playback_Resume); video (Video_PiP, Video_Encoding, Video_Playback_Background); sharing (System_Sharesheet); background services (Background_Service_Optimization).
  - Performance and stability: App_Startup_Time, Rendering_Performance, StrictMode_Compliance, Stability_ANR; SDK (Android_Platform_Compatibility, Target_SDK_Version, Compile_SDK_Version, SDK_Maintenance, Non_SDK_Interfaces, Production_Build_Quality); battery (Power_Management).
  - Privacy and security: permissions (Minimize_Permissions, Sensitive_Permissions, Runtime_Permissions, Permission_Rationale, Graceful_Degradation); data and files (Sensitive_Data_Storage, Sensitive_Data_Logging, Hardware_IDs); backup (App_Data_Backup, App_Logins_Restoration); identity (Autofill_Hints, Credential_Manager, Biometric_Authentication); app components (Component_Export, Component_Permissions, Component_Protection); networking (Network_Security_Traffic, Network_Security_Configuration, Security_Provider_Initialization); WebViews (WebView_Asset_Loader, WebView_JavaScript, WebView_Navigation); execution (App_Bundles); cryptography (Cryptographic_Algorithms).
  - Google Play: Play_Content_Policies, Play_Content_Rating, Play_Feature_Graphic, Play_Device_References, Play_Misleading_Content, Play_User_Reviews.
- Supporting sections: Test environment (emulators for foldables, tablets, and Wear OS; representative hardware; third-party test labs such as Firebase Test Lab; the latest Android version), StrictMode, Tests (procedures grouped by area), Archive.
- Normative vs informative: the guideline tables are the checklist and the test procedures say how to check it. Test environment and StrictMode are informative setup.

### Adaptive app quality (overview 2026-04-10)

- Identifier scheme: name-style guideline IDs and `T-` test IDs, the same style as core. The superseded large screen version used `LS-<area><n>` codes (LS-C, LS-M, LS-CM, LS-I, LS-S, LS-U, LS-F, LS-D, LS-P) and tier-numbered test IDs (T3-n, T2-n, T1-n). The ID map converts them, for example LS-C1 to Config_Changes, LS-U3 to Touch_Targets, and T3-1 to T-Config_Orientation.
- Tier 3, Adaptive ready (2026-08-18). Guideline IDs: Config_Changes, Config_Combinations, Multi-Window_Functionality, Multi-Resume, Camera_Preview, Media_Projection, Keyboard_Input, Mouse_Trackpad_Basic, Stylus_Basic, Stylus_Text_Input. Tests include T-Config_Orientation, T-Config_State, T-Config_Combinations, T-Multi-Window_Functionality, T-Multi-Window_Focus, T-Multi-Window_Resources, T-Camera_Preview, T-Media_Projection, T-Keyboard_Input, T-Mouse_Trackpad_Basic, T-Stylus_Basic, T-Stylus_Text_Input. Per the extraction, T-Config_Orientation checks for no letterboxing on large screens (smallest width at least 600 dp, Android 12 or later), whatever orientation or resizability the manifest declares.
- Tier 2, Adaptive optimized (2026-08-18). Guideline IDs: Responsive_adaptive_layouts, UI_Secondary_Elements, Touch_Targets, Drawable_Focus, Keyboard_Navigation, Keyboard_Shortcuts, Keyboard_Media_Playback, Keyboard_Send, Keyboard_Exit, Context_Menus, Content_Zoom, Hover_States. Tests: T-Layout_Flow, T-Touch_Targets, T-Drawable_Focus, and one T-<ID> for each input item.
- Tier 1, Adaptive differentiated (2026-04-10). This page is a hub of experience tracks. The four under adaptive app quality:
  - Desktop (2026-08-18): Scrollbar_Display, Hover_Parity, Desktop_Menus, UI_Config, Request_Fullscreen_Mode, Keyboard_Navigation, Keyboard_Parity, Input_Combinations, Triple_Click, Multitasking_Scenarios, Multitasking_PiP, Multi-Instance, Drag_Drop_Support, Drag_Drop_Batch, Printing_Support, File_Management_Basics, File_Picker, File_Handlers, Custom_Cursors, Cursor_Target_Size, Cross_Device_Handoff, Offline_Support, Web_Transition.
  - Foldables (2026-08-18): Foldables_Postures, Foldables_Camera, Foldables_Multitasking_Scenarios, Foldables_PiP, Foldables_Multi-Instance.
  - Camera and Audio (2026-08-18): Camera_Switcher, Audio_Switcher, Audio_Background_Playback.
  - Stylus (2026-08-18): Stylus_Draw_Write, Stylus_Drag_Drop, Stylus_Enhanced.
  - The Tier 1 page extraction also listed Cars, TV, XR, Games, and Widgets as experiences, which link to separate guideline sets (see Uncertainties).
- Compatibility test devices in the overview: foldable 841x701 dp, 8-inch tablet 1024x640 dp, 10.5-inch tablet 1280x800 dp, and 13-inch Chromebook 1600x900 dp. Recommended emulators: 7.6-inch fold-in with outer display, Pixel C tablet, Surface Duo dual-display, and a resizable emulator. Useful later as the Android device matrix (Phase 5).
- Normative vs informative: the tier checklists and test procedures are the assessable content. The overview, get-started text, and device list are informative.

## Candidate rules

Proposed prefix: `ANDROIDQ`, mapped only to SRC-GOOGLE-ANDROID-QUALITY. The identifier is the source's own current label, unchanged (for example `ANDROIDQ-Touch_Target_Size`), bound to the name-style scheme of the 2026-09-21 core and 2026-04-10/08-18 adaptive pages. Per `docs/rule-schema.md` §3, a future renumbering would need a new prefix (see Uncertainties). Rule class is PLATFORM throughout. Strength follows each item's own wording: most core items say should (SHOULD), but a research reviewer found must in Audio_Playback_Background and Audio_Notification_Style and App Bundles described as mandatory (MUST), and the Tier 3 page opens by requiring adaptive-ready apps to meet the core requirements first. Proposed tier mapping: Tier 3 SHOULD for apps that run on large screens or in windows, and Tier 2 and Tier 1 MAY (higher tiers an app opts into). (An earlier draft said no item uses must; corrected after review.) Testability is a guess (automated / visual / manual).

UI and UX items (priority for this project):

- ANDROIDQ-Display_State_Parity: orientations and fold states expose the same features and actions. SHOULD. NONE / PARTIAL / FULL.
- ANDROIDQ-Fullscreen_Display: app fills its window in both orientations and across fold and unfold, with no letterboxing beyond minor geometry compensation. SHOULD. PARTIAL (screenshot letterbox detection) / FULL / FULL.
- ANDROIDQ-Orientation_Transitions: rapid rotation and fold transitions cause no rendering problems and no state loss. SHOULD. PARTIAL / PARTIAL / FULL.
- ANDROIDQ-State_Preservation: user and app state is kept across transitions (backgrounding, configuration changes). SHOULD. PARTIAL / NONE / FULL.
- ANDROIDQ-Graphic_Quality: graphics and text show no noticeable distortion, blur, pixelation, or edge aliasing; vector drawables where possible; assets for all targeted screen sizes. SHOULD. PARTIAL / FULL / FULL.
- ANDROIDQ-Line_Length: text line length limited to about 45 to 75 characters including spaces. SHOULD. PARTIAL / FULL / FULL.
- ANDROIDQ-Theme_Support: app supports both light and dark themes. SHOULD. PARTIAL / FULL / FULL.
- ANDROIDQ-Back_Button_Nav: standard system back is supported, with no custom on-screen back prompts. SHOULD. NONE / PARTIAL / FULL.
- ANDROIDQ-Back_Gesture_Nav: gesture navigation works for back and home. SHOULD. NONE / NONE / FULL.
- ANDROIDQ-Touch_Target_Size: touch targets at least 48 dp. SHOULD. FULL (view hierarchy) / PARTIAL / FULL. Crosswalk: WCAG 2.5.8 (24 CSS px, AA) and 2.5.5 (44 px, AAA); SRC-GOOGLE-ANDROID-A11Y.
- ANDROIDQ-Visual_Contrast: contrast of 4.5:1 for small text and 3:1 for large text and graphics, where large means 18 pt or 14 pt bold. SHOULD. PARTIAL / FULL / FULL. Crosswalk: WCAG 1.4.3 and 1.4.11.
- ANDROIDQ-Content_Description: every UI element except TextView has a content description. SHOULD. PARTIAL / NONE / FULL. Crosswalk: WCAG 1.1.1 and 4.1.2.
- ANDROIDQ-Consistent_UX / App_Switcher / Sleep_Resume / Lock_Resume: consistent experience across form factors, and correct pause and resume across Recents, sleep, and lock. SHOULD. NONE / NONE / FULL.
- ANDROIDQ-Notification_Quality / Conversation_Quality: relevant notifications with proper channels and priority; messaging apps use messaging-style notifications, direct reply, and bubbles. SHOULD. NONE / PARTIAL / FULL.
- ANDROIDQ-App_Startup_Time: app loads quickly or shows progress feedback if startup takes longer than two seconds. SHOULD. PARTIAL (runtime timing) / PARTIAL / FULL.
- ANDROIDQ-Rendering_Performance: frames render in 16 ms or less (at least 60 fps). SHOULD. PARTIAL (profiling) / NONE / PARTIAL.
- ANDROIDQ-Audio_Playback_Start: audio starts, or a loading indicator appears, within one second. SHOULD. PARTIAL / PARTIAL / FULL.
- ANDROIDQ-Permission_Rationale / Runtime_Permissions / Graceful_Degradation: request permissions in context when needed, explain why, and keep working when a permission is denied. SHOULD. NONE / PARTIAL / FULL. Candidate for OTH-PRIVACY-UX.
- ANDROIDQ-Autofill_Hints: fields provide autofill hints. SHOULD. PARTIAL (source or hierarchy) / NONE / PARTIAL. Candidate for UX-FORMS.
- ANDROIDQ-Config_Changes (Tier 3; was LS-C1): app fills the display without letterboxing or compatibility mode, and keeps state (scroll position, text input, playback) through rotation, fold, and window resize. SHOULD. PARTIAL / PARTIAL / FULL.
- ANDROIDQ-Config_Combinations (Tier 3; was LS-C2): app handles combined or sequential configuration changes. SHOULD. NONE / PARTIAL / FULL.
- ANDROIDQ-Multi-Window_Functionality / Multi-Resume (Tier 3; was LS-M1/M2): fully functional in multi-window at all sizes; keeps updating when unfocused and gives up exclusive resources. SHOULD. NONE / PARTIAL / FULL.
- ANDROIDQ-Camera_Preview / Media_Projection (Tier 3; was LS-CM1/CM2): correctly oriented and proportioned in every orientation, fold state, and window size. SHOULD. NONE / FULL / FULL.
- ANDROIDQ-Keyboard_Input / Mouse_Trackpad_Basic / Stylus_Basic / Stylus_Text_Input (Tier 3; was LS-I1/I2/S1/S1.1): external keyboard input and switching between keyboards without relaunch; basic click, select, and scroll; basic stylus selection and scroll; stylus text entry in EditText on Android 14 (API 34) and later. SHOULD. NONE / NONE / FULL.
- ANDROIDQ-Responsive_adaptive_layouts (Tier 2; was LS-U1): layouts adapt to all screen sizes using window size classes, with multi-pane layouts where suitable. MAY. PARTIAL (multi-viewport screenshots) / FULL / FULL.
- ANDROIDQ-UI_Secondary_Elements (Tier 2; was LS-U2): sheets, dialogs, menus, navigation rails and drawers, and text fields are formatted well on every screen type. MAY. NONE / FULL / FULL.
- ANDROIDQ-Touch_Targets (Tier 2; was LS-U3): 48 dp touch targets on large screens. Duplicates core Touch_Target_Size; normalize to one rule with an `equivalent` link. MAY. FULL / PARTIAL / FULL.
- ANDROIDQ-Drawable_Focus (Tier 2; was LS-U4): interactive custom drawables show a visible focused state outside touch mode. MAY. PARTIAL / FULL / FULL. Crosswalk: WCAG 2.4.7.
- ANDROIDQ-Keyboard_Navigation / Keyboard_Shortcuts / Keyboard_Media_Playback / Keyboard_Send / Keyboard_Exit (Tier 2; was LS-I3 to I6 and new): Tab and arrow navigation through main flows; standard edit shortcuts; space bar for play and pause; Enter to send; Esc to dismiss or cancel. MAY. NONE / NONE / FULL. Crosswalk: WCAG 2.1.1.
- ANDROIDQ-Context_Menus / Content_Zoom / Hover_States (Tier 2; was LS-I7 to I9): right-click or secondary-tap context menus, Ctrl+scroll and pinch zoom, and hover states on actionable elements. MAY. NONE / PARTIAL / FULL.
- Tier 1 desktop, foldables, camera and audio, and stylus items (for example Scrollbar_Display, Hover_Parity, Desktop_Menus, Custom_Cursors, Cursor_Target_Size, Drag_Drop_Support, Foldables_Postures, Offline_Support): premium differentiators. MAY. Mostly manual. Extract only when an audit declares a Tier 1 target.

Items outside UI/UX audit scope, recorded but not proposed as UI rules: Functionality items for audio focus and background playback, video encoding, and the background-service item; SDK, StrictMode, ANR, and battery items; data-storage, networking, component, WebView, cryptography, and App Bundle security items; Google Play store-listing items. They may serve a later code or security audit mode, which is not in current scope.

## Cross-references

- Android platform behavior changes, read 2026-09-23 at developer.android.com. Cross-references only, not part of this source. They matter because they make some quality items platform-enforced for apps at a given targetSdk, which raises the risk when an app does not adapt.
  - Android 15, "Behavior changes: Apps targeting Android 15 or higher", https://developer.android.com/about/versions/15/behavior-changes-15, footer 2026-09-16:
    - Apps targeting API 35 are edge-to-edge by default on Android 15 devices. The status bar and the gesture navigation bar are transparent, and the 3-button navigation bar is translucent (80% opacity by default). Content draws behind system bars unless the app applies insets.
    - Display-cutout layout modes for non-floating windows are treated as "always".
    - Several status-bar and navigation-bar color and decor-fits APIs are deprecated, and some are also disabled.
    - elegantTextHeight defaults to true.
    - Configuration screen width and height no longer exclude system bars.
    - A targeted search found no opt-out attribute on this page; the opt-out is named on the Android 16 page.
  - Android 16 (API 36), "Behavior changes: Apps targeting Android 16 or higher", https://developer.android.com/about/versions/16/behavior-changes-16, footer 2026-09-16:
    - `R.attr#windowOptOutEdgeToEdgeEnforcement` is deprecated and disabled, so edge-to-edge can no longer be opted out.
    - Predictive back system animations (back-to-home, cross-task, cross-activity) are on by default for apps targeting 36 on Android 16 or later devices. onBackPressed is no longer called and KEYCODE_BACK is no longer dispatched. A temporary opt-out exists: `android:enableOnBackInvokedCallback="false"`.
    - Under "Adaptive layouts", orientation, resizability, and aspect-ratio restrictions (screenOrientation, resizeableActivity, min and max aspect ratio, setRequestedOrientation, getRequestedOrientation) are ignored on displays with smallest width >= 600dp. Exceptions: games (by android:appCategory), smaller displays, and users who choose the app default in aspect-ratio settings.
    - A temporary opt-out, `PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY` (activity or application level), stops applying at API 37.
    - elegantTextHeight is deprecated and disabled.
  - Android 17 (API 37), https://developer.android.com/about/versions/17/behavior-changes-17 and the detail page https://developer.android.com/about/versions/17/changes/ff-restrictions-ignored, both footer 2026-09-16:
    - Android 17 removes the temporary Android 16 opt-out. For apps targeting 37, orientation, resizability, and aspect-ratio restrictions no longer apply on displays whose smallest width is "greater than 600dp", with the same exceptions.
    - The page recommends testing for letterboxing, state loss on configuration change, and stretched, rotated, or cropped camera preview.
    - Other UI-relevant changes: password characters hidden by default for physical-keyboard input, and a RemoteViews bitmap memory limit.
  - Mapping to this source: these changes enforce Tier 3 Config_Changes, Camera_Preview, and core Fullscreen_Display and Orientation_Transitions on large screens. They also enforce edge-to-edge, which the quality pages do not mention, and predictive back, which core Back_Gesture_Nav does not mention. Android-specific safe-area and back-animation rules therefore need their own anchor. Candidate source: Android behavior changes, or the edge-to-edge and predictive back developer guides.
- SRC-GOOGLE-ANDROID-A11Y: overlaps Touch_Target_Size, Visual_Contrast, and Content_Description. Normalize to one Android rule with `equivalent` links.
- SRC-GOOGLE-MATERIAL3: Touch_Target_Size cites Material layout guidance. Responsive_adaptive_layouts relies on window size classes and canonical layouts (list-detail), which Material 3 defines.
- SRC-W3C-WCAG22: Visual_Contrast matches the 1.4.3 thresholds and large-text definition. Touch targets relate to 2.5.8 and 2.5.5. Display_State_Parity and Config_Changes complement 1.3.4 Orientation. Keyboard items relate to 2.1.1 and 2.4.7. WCAG2ICT (SRC-W3C-WCAG2ICT) governs how WCAG applies to native apps.
- SRC-APPLE-HIG: the iOS and iPadOS counterpart for adaptivity, orientation, and multitasking.
- Sibling Google quality guideline sets in the same section. Candidate sources, not researched: Wear OS app quality, TV app quality, Car app quality, Android XR app quality, and widget quality.

## Uncertainties and gaps

1. License contradiction. The existing SRC-GOOGLE-ANDROID-A11Y row reads the site license as CC Attribution 2.5 for content and Apache 2.0 for code. The /license page, read 2026-09-23, says documentation including code is under Apache 2.0 unless otherwise noted, and other content is under CC BY 2.5. Which license covers guideline prose is not stated. Both permit attributed paraphrase, so the practical impact is low. Mirror as a CONTRADICTION (GAP-034 also asks for this re-check).
2. Threshold wording contradiction. The Android 16 page says smallest width >= 600dp ("at least sw600dp"); the Android 17 detail page says "greater than 600dp". This affects only displays at exactly 600dp. Mirror as a CONTRADICTION.
3. ID instability. The core IDs changed from `VX-*` codes (2021) to `Area:Short` (2026-03-20) to name-style (2026-09-21), and no core ID map was found. The adaptive IDs changed from `LS-*` to name-style, with an ID map. The core page was updated two days before this verification. Decide whether `ANDROIDQ` binds to the current scheme (rule-schema §3: a renumbering version gets a new prefix). Re-verify before Phase 2 extraction.
4. One row or two. Core and adaptive have separate dates and archives. Plan §4 treats a row covering documents that each need their own version metadata as an umbrella placeholder. The lead should decide whether to keep one source (App quality section, one authority and license) or split into core and adaptive rows.
5. Normative strength per tier is proposed (Tier 3 SHOULD, Tiers 2 and 1 MAY), not stated by the source. It may need a "target tier" audit parameter decided in Phase 2 or 3.
6. Android 17 release status is unconfirmed. The overview page (footer 2026-07-01) shows Beta device links plus QPR1 and QPR2 Beta tracks but no explicit stable-release statement. The release notes list Beta 4.1 (1 June 2026) as the latest entry. The API 37 behavior applies by targetSdk whatever the release state.
7. Extraction limits. Pages were read through a summarizing fetch tool, not raw HTML. Items to re-read in Phase 2:
   - tests listed without a matching guideline ID (T-SD_Card, T-Sensitive_Data_Handling, T-Play_Graphic_Assets);
   - Keyboard_Navigation appears in both Tier 2 and Desktop;
   - the Tier 1 page listed nine experiences (including Cars, TV, XR, Games, Widgets), while the side navigation shows four;
   - a first fetch of the Android 17 detail page named a different Android 16 opt-out constant (TEMPORARY_DEVELOPER_OPT_OUT_ORIENTATION_REQUEST_WHEN_LOOP_DETECTED), which the verbatim re-fetch did not reproduce. The verbatim sentences are recorded above, and the Android 16 page names PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY.
8. Trust-boundary observation. One fetch of https://developer.android.com/about/versions/17 returned a line addressed to "a Claude agent". The fetch tool attributed that line to its own prompt, not the page, and a re-fetch found no agent-addressed text in the page content. It was not acted on.
9. Coverage. These pages do not address edge-to-edge, insets, display cutouts, or predictive back, so they do not support VIS-SAFE-AREAS. An Android behavior-changes or edge-to-edge source would be needed for Android-specific safe-area rules.
